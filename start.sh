#!/bin/bash

DEFAULT_RELEASE_NAME="my-release"
NAMESPACE="default"
CHART_PATH="./path/to/chart"
VALUES_FILE="./path/to/values.yaml"

install_chart() {
  echo "Installing Helm chart..."
  helm install $RELEASE_NAME $CHART_PATH -n $NAMESPACE -f $VALUES_FILE
}

upgrade_chart() {
  echo "Upgrading Helm chart..."
  helm upgrade $RELEASE_NAME $CHART_PATH -n $NAMESPACE -f $VALUES_FILE
}

if [ -z "$2" ]; then
  RELEASE_NAME=$DEFAULT_RELEASE_NAME
else
  RELEASE_NAME=$2
fi

# Check if release exists
release_exists=$(helm ls -n $NAMESPACE | grep $RELEASE_NAME)

# Main logic
if [ "$1" == "install" ]; then
  if [ -z "$release_exists" ]; then
    install_chart
  else
    echo "Release already exists. Use 'upgrade' option to upgrade the chart."
  fi
elif [ "$1" == "upgrade" ]; then
  if [ -n "$release_exists" ]; then
    upgrade_chart
  else
    echo "Release does not exist. Use 'install' option to install the chart."
  fi
else
  echo "Usage: $0 {install|upgrade} [release_name]"
fi