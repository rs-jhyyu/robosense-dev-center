---
title: One-Click Install Script
sidebar_position: 7
---
# One-Click Install Script install_one_click.sh

This page provides an install script suited to standard ROS/ROS2 environments. Place the `install_one_click.sh` script file in the directory of your choice and run the command below. Once it finishes, you can skip the install and build steps in the SDK user guide:

```shell-session
user@user:~$ bash install_one_click.sh
```

Script download: [install_one_click.sh](pathname:///downloads/SDK&Driver/install_one_click.sh)

## Command-Line Options

| Option | Description |
| --- | --- |
| `-w DIR` | Workspace path (default: `rslidar_ws` under the current directory) |
| `-r` | Install ROS/ROS2 automatically |
| `-d` | Install system dependencies only, skip the build |
| `-h` | Show the help message |

## Execution Flow

The script runs through the following 7 steps in order:

| Step | Contents |
| --- | --- |
| Step 0 | Clear the Git proxy configuration (restored automatically on exit) |
| Step 1 | Detect the system environment (distribution, version, architecture) |
| Step 2 | Detect the ROS/ROS2 environment; if both are present, prompt the user to choose |
| Step 3 | Install system dependencies (`libyaml-cpp-dev`, `libpcap-dev`, `cmake`, `git`, etc.) |
| Step 4 | Load the corresponding ROS environment variables |
| Step 5 | Fetch the source code (`rslidar_sdk`, the `rs_driver` submodule, plus `rslidar_msg` under ROS2), retrying up to 3 times per source |
| Step 6 | Build the project (`catkin_make` for ROS1, `colcon build` for ROS2, plain cmake build of `rs_driver` when no ROS is present) |
| Step 7 | Print the post-install checklist |

## Notes

:::warning
This script has only been tested in standard ROS/ROS2 environments. If your environment is more complex, we recommend installing and building manually using the commands in the SDK user guide.
:::

- In some cases you need to **re-source the ROS environment after the build completes**.
- The script does not initialize the built SDK working environment, so you still need to **start the SDK manually** with the commands below:

```shell-session
# Using a ROS1 environment as an example
user@user:~/workspace$ source devel/setup.bash                       # load the environment
user@user:~/workspace$ roslaunch rslidar_sdk start.launch            # start the driver
```

- Run this script with `bash`, not `sh` (dash does not support `source`).

## Post-Install Checklist

After the script finishes, confirm the following items:

1. Update `config.yaml`: `lidar_type` / `msop_port` / `difop_port`.
2. Set the network interface IP to the LiDAR's destination IP, for example `sudo ifconfig eno1 192.168.1.102`.
3. Disable the firewall: `sudo ufw disable`.
4. Verify with Wireshark that MSOP/DIFOP packets are being received.
