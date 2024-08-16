#!/bin/bash

REGISTRY="https://npmjs-registry.ivyteam.ch/"

npm unpublish "@axonivy/dataclass-editor@${1}" --registry $REGISTRY
