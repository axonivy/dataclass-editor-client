#!/bin/bash

REGISTRY="https://npmjs-registry.ivyteam.ch/"

npm unpublish "@axonivy/dataclass-editor@${1}" --registry $REGISTRY
npm unpublish "@axonivy/dataclass-editor-protocol@${1}" --registry $REGISTRY
