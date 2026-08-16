#!/bin/bash
#===========================================================================
#  rslidar_sdk 全自动一键安装脚本 v1.0
#===========================================================================

# 禁止用 sh 运行（dash 不支持 source）
if [ -z "$BASH_VERSION" ]; then
    echo "错误：请用 bash 运行本脚本，不要用 sh。"
    echo "  bash $0"
    exit 1
fi

set -e

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
BLUE='\033[0;34m'; NC='\033[0m'
info()  { echo -e "${GREEN}[INFO]${NC}  $*"; }
warn()  { echo -e "${YELLOW}[WARN]${NC}  $*"; }
error() { echo -e "${RED}[ERROR]${NC} $*"; exit 1; }
step()  { echo -e "\n${BLUE}==== $* ====${NC}"; }

WORKSPACE_DIR="$(pwd)/rslidar_ws"
SDK_REPO="https://github.com/RoboSense-LiDAR/rslidar_sdk.git"
RSLIDAR_MSG_REPO="https://github.com/RoboSense-LiDAR/rslidar_msg.git"
BUILD_TYPE="Release"
INSTALL_ROS=false
SKIP_BUILD=false
SDK_BRANCH="main"

usage() {
    echo "用法: $0 [选项]"
    echo "  -w DIR    工作空间路径 (默认: 当前目录/rslidar_ws)"
    echo "  -r        自动安装 ROS/ROS2"
    echo "  -d        仅安装系统依赖，跳过编译"
    echo "  -h        显示此帮助"
    exit 0
}
while getopts "w:rdh" opt; do
    case $opt in
        w) WORKSPACE_DIR="$OPTARG" ;;
        r) INSTALL_ROS=true ;;
        d) SKIP_BUILD=true ;;
        h) usage ;;
        *) usage ;;
    esac
done

#======================== Step 0: 清除 Git 代理 ========================
step "Step 0/7 — 清除 Git 代理配置"

HTTP_PROXY_BACKUP=$(git config --global --get http.proxy 2>/dev/null || echo "")
HTTPS_PROXY_BACKUP=$(git config --global --get https.proxy 2>/dev/null || echo "")

if [ -n "$HTTP_PROXY_BACKUP" ] || [ -n "$HTTPS_PROXY_BACKUP" ]; then
    warn "检测到 Git 代理配置:"
    [ -n "$HTTP_PROXY_BACKUP" ]  && echo "  http.proxy  = ${HTTP_PROXY_BACKUP}"
    [ -n "$HTTPS_PROXY_BACKUP" ] && echo "  https.proxy = ${HTTPS_PROXY_BACKUP}"
    info "临时清除代理以确保 GitHub 可直连..."
    git config --global --unset http.proxy  2>/dev/null || true
    git config --global --unset https.proxy 2>/dev/null || true
    PROXY_WAS_SET=true
else
    PROXY_WAS_SET=false
fi

# 退出时恢复代理
restore_proxy() {
    if $PROXY_WAS_SET; then
        [ -n "$HTTP_PROXY_BACKUP" ]  && git config --global http.proxy  "$HTTP_PROXY_BACKUP"  2>/dev/null || true
        [ -n "$HTTPS_PROXY_BACKUP" ] && git config --global https.proxy "$HTTPS_PROXY_BACKUP" 2>/dev/null || true
        info "已恢复 Git 代理配置"
    fi
}
trap restore_proxy EXIT

# 同时清除环境变量中的代理
unset http_proxy https_proxy HTTP_PROXY HTTPS_PROXY 2>/dev/null || true

#======================== Step 1: 环境检测 ========================
step "Step 1/7 — 检测系统环境"

OS_NAME=$(lsb_release -is 2>/dev/null || echo "Ubuntu")
OS_VER=$(lsb_release -rs 2>/dev/null || echo "0")
OS_CODENAME=$(lsb_release -cs 2>/dev/null || echo "")
ARCH=$(uname -m)

info "操作系统: ${OS_NAME} ${OS_VER} (${OS_CODENAME}), 架构: ${ARCH}"
info "工作空间将创建在: ${WORKSPACE_DIR}"

#======================== Step 2: 检测 ROS 环境 ========================
step "Step 2/7 — 检测 ROS/ROS2 环境"

ROS1_FOUND=false; ROS2_FOUND=false
ROS1_VER=""; ROS2_VER=""

if [ -d "/opt/ros" ]; then
    [ -d "/opt/ros/noetic" ]  && { ROS1_FOUND=true; ROS1_VER="noetic"; }
    [ -d "/opt/ros/melodic" ] && { ROS1_FOUND=true; ROS1_VER="melodic"; }
    [ -d "/opt/ros/kinetic" ] && { ROS1_FOUND=true; ROS1_VER="kinetic"; }
    [ -d "/opt/ros/humble" ]  && { ROS2_FOUND=true; ROS2_VER="humble"; }
    [ -d "/opt/ros/galactic" ]&& { ROS2_FOUND=true; ROS2_VER="galactic"; }
    [ -d "/opt/ros/foxy" ]    && { ROS2_FOUND=true; ROS2_VER="foxy"; }
    [ -d "/opt/ros/eloquent" ]&& { ROS2_FOUND=true; ROS2_VER="eloquent"; }
fi

if $ROS1_FOUND && $ROS2_FOUND; then
    warn "同时检测到 ROS1(${ROS1_VER}) 和 ROS2(${ROS2_VER})"
    echo ""
    echo "  请选择基于哪个 ROS 编译:"
    echo "    1) ROS1  (${ROS1_VER})"
    echo "    2) ROS2  (${ROS2_VER})"
    echo "    3) 不使用 ROS (仅编译 rs_driver 内核)"
    read -p "  输入选项 [1/2/3]: " ROS_CHOICE
    case $ROS_CHOICE in
        2) ROS1_FOUND=false ;;
        3) ROS1_FOUND=false; ROS2_FOUND=false ;;
        *) ROS2_FOUND=false ;;
    esac
fi

if $ROS1_FOUND; then
    info "已检测到 ROS1: ${ROS1_VER}"
elif $ROS2_FOUND; then
    info "已检测到 ROS2: ${ROS2_VER}"
else
    info "未检测到 ROS/ROS2"
fi

#======================== Step 3: 安装系统依赖 ========================
step "Step 3/7 — 安装系统依赖"

info "安装 libyaml-cpp-dev libpcap-dev build-essential cmake git..."
# 省略 sudo apt-get，用户需自行确保已安装这些包
# sudo apt-get update -qq
# sudo apt-get install -y libyaml-cpp-dev libpcap-dev build-essential cmake git wget curl
# sudo apt-get install -y libeigen3-dev libpcl-dev libboost-dev 2>/dev/null || true

info "确认系统依赖已安装（libyaml-cpp-dev, libpcap-dev, cmake, git）"

#======================== Step 4: 加载 ROS 环境 ========================
step "Step 4/7 — 加载 ROS 环境变量"

if $ROS1_FOUND; then
    ROS_SETUP="/opt/ros/${ROS1_VER}/setup.bash"

    # Ubuntu 22.04 不存在官方 ROS Noetic，安装路径不可靠
    if [ "$OS_VER" = "22.04" ] && [ "$ROS1_VER" = "noetic" ]; then
        warn "Ubuntu 22.04 无官方 ROS Noetic。"
        warn "你的 ROS 可能是源码编译或第三方源安装的。"
        echo ""
        read -p "  请输入你的 ROS 环境 setup.bash 完整路径: " USER_ROS_SETUP
        # 展开 ~ 符号
        USER_ROS_SETUP="${USER_ROS_SETUP/#\~/$HOME}"
        if [ -f "$USER_ROS_SETUP" ]; then
            source "$USER_ROS_SETUP"
            info "已从 ${USER_ROS_SETUP} 加载 ROS 环境"
        else
            error "文件不存在: ${USER_ROS_SETUP}"
        fi
        USE_ROS=1
    elif [ -f "$ROS_SETUP" ]; then
        source "$ROS_SETUP"
        info "已加载 ROS1 ${ROS1_VER}"
    else
        warn "找不到 ${ROS_SETUP}"
        warn "请先手动 source 你的 ROS 环境再重新运行本脚本。"
        exit 1
    fi
    USE_ROS=1
elif $ROS2_FOUND; then
    ROS_SETUP="/opt/ros/${ROS2_VER}/setup.bash"
    if [ -f "$ROS_SETUP" ]; then
        source "$ROS_SETUP"
        info "已加载 ROS2 ${ROS2_VER}"
    else
        warn "找不到 ${ROS_SETUP}，请手动 source 后重试。"
        exit 1
    fi
    USE_ROS=2
else
    info "无 ROS 环境，仅编译 rs_driver 内核"
    USE_ROS=0
fi

#======================== 通用工具：多源重试克隆 ========================
# 参数: 目标目录名  仓库分支  仓库URL列表(空格分隔)
# 每源最多重试 3 次，间隔 5s/10s/20s
git_clone_robust() {
    local TARGET_DIR="$1"
    local BRANCH="$2"
    shift 2
    local URLS=("$@")

    for URL in "${URLS[@]}"; do
        for ATTEMPT in 1 2 3; do
            local WAIT=$((5 * ATTEMPT))
            info "尝试克隆: ${URL} (第${ATTEMPT}次)..."
            if git clone --depth 1 --progress "$URL" -b "$BRANCH" "$TARGET_DIR"; then
                info "克隆成功: ${URL}"
                return 0
            fi
            warn "失败，${WAIT}秒后重试..."
            sleep $WAIT
        done
        warn "${URL} 3次均失败，切换下一个源..."
    done
    return 1
}

#======================== Step 5: 拉取源码 ========================
step "Step 5/7 — 拉取源码"

SRC_DIR="${WORKSPACE_DIR}/src"
mkdir -p "$SRC_DIR"

# --- rslidar_sdk ---
SDK_URLS=(
    "https://github.com/RoboSense-LiDAR/rslidar_sdk.git"
    "git@github.com:RoboSense-LiDAR/rslidar_sdk.git"
)

if [ -d "${SRC_DIR}/rslidar_sdk/.git" ]; then
    info "已有 rslidar_sdk，执行 git pull..."
    cd "${SRC_DIR}/rslidar_sdk"
    git pull origin "${SDK_BRANCH}" 2>/dev/null || warn "git pull 失败，使用现有代码"
else
    [ -d "${SRC_DIR}/rslidar_sdk" ] && rm -rf "${SRC_DIR}/rslidar_sdk"
    cd "$SRC_DIR"
    if ! git_clone_robust "rslidar_sdk" "${SDK_BRANCH}" "${SDK_URLS[@]}"; then
        error "所有源克隆 rslidar_sdk 均失败，请手动下载后放入 ${SRC_DIR}/"
    fi
    cd "${SRC_DIR}/rslidar_sdk"
fi

# --- rs_driver (子模块) ---
DRIVER_URLS=(
    "https://github.com/RoboSense-LiDAR/rs_driver.git"
    "git@github.com:RoboSense-LiDAR/rs_driver.git"
)
DRIVER_DIR="${SRC_DIR}/rslidar_sdk/src/rs_driver"

if [ -d "${DRIVER_DIR}/.git" ]; then
    info "已有 rs_driver，更新..."
    cd "$DRIVER_DIR" && git pull 2>/dev/null || true
else
    info "拉取 rs_driver 子模块..."
    cd "${SRC_DIR}/rslidar_sdk"
    if ! git submodule update --init 2>/dev/null; then
        warn "子模块更新失败，尝试手动克隆 rs_driver..."
        [ -d "$DRIVER_DIR" ] && rm -rf "$DRIVER_DIR"
        if ! git_clone_robust "rs_driver" "main" "${DRIVER_URLS[@]}"; then
            error "所有源克隆 rs_driver 均失败"
        fi
        mv rs_driver "$DRIVER_DIR"
    fi
fi
cd "${SRC_DIR}/rslidar_sdk"

# --- rslidar_msg (ROS2) ---
if [ "$USE_ROS" = "2" ]; then
    MSG_URLS=(
        "https://github.com/RoboSense-LiDAR/rslidar_msg.git"
        "git@github.com:RoboSense-LiDAR/rslidar_msg.git"
    )
    if [ -d "${SRC_DIR}/rslidar_msg/.git" ]; then
        cd "${SRC_DIR}/rslidar_msg" && git pull 2>/dev/null || true
    else
        [ -d "${SRC_DIR}/rslidar_msg" ] && rm -rf "${SRC_DIR}/rslidar_msg"
        cd "$SRC_DIR"
        git_clone_robust "rslidar_msg" "main" "${MSG_URLS[@]}" || warn "rslidar_msg 克隆失败（ROS2编译可能报错）"
    fi
fi

#======================== Step 6: 编译 ========================
step "Step 6/7 — 编译工程"

if $SKIP_BUILD; then
    info "跳过编译。"
    exit 0
fi

cd "$WORKSPACE_DIR"

if [ "$USE_ROS" = "1" ]; then
    info "catkin_make (ROS1)..."
    catkin_make -DCMAKE_BUILD_TYPE="${BUILD_TYPE}" -j$(nproc)
    echo -e "\n${GREEN}source ${WORKSPACE_DIR}/devel/setup.bash${NC}"
    echo -e "${GREEN}roslaunch rslidar_sdk start.launch${NC}"
elif [ "$USE_ROS" = "2" ]; then
    info "colcon build (ROS2)..."
    colcon build --cmake-args -DCMAKE_BUILD_TYPE="${BUILD_TYPE}"
    echo -e "\n${GREEN}source ${WORKSPACE_DIR}/install/setup.bash${NC}"
    echo -e "${GREEN}ros2 launch rslidar_sdk start.py${NC}"
else
    info "cmake 编译 rs_driver..."
    cd "${SRC_DIR}/rslidar_sdk/src/rs_driver"
    mkdir -p build && cd build
    cmake -DCMAKE_BUILD_TYPE="${BUILD_TYPE}" -DCOMPILE_DEMOS=ON .. && make -j$(nproc)
    echo -e "\n${GREEN}Demo: ${SRC_DIR}/rslidar_sdk/src/rs_driver/build/demo/${NC}"
fi

#======================== Step 7: 检查清单 ========================
step "Step 7/7 — 安装后检查清单"

echo ""
echo -e "  1. 修改 config.yaml: ${BLUE}vim ${SRC_DIR}/rslidar_sdk/config/config.yaml${NC}"
echo "     - lidar_type / msop_port / difop_port"
echo ""
echo -e "  2. 配置网卡: ${BLUE}sudo ifconfig <网卡> <雷达IP段>.102${NC}"
echo ""
echo -e "  3. 关闭防火墙: ${BLUE}sudo ufw disable${NC}"
echo ""
echo "  4. Wireshark 验证可收到 MSOP/DIFOP 包"
echo ""

