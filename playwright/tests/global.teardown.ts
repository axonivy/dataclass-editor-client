import { rm } from 'node:fs';

const teardown = async () => {
  rm('./dataclass-test-project/dataclasses/temp', { force: true, recursive: true }, () => {});
};

export default teardown;
