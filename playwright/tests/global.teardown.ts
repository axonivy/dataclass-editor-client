import { rm } from 'node:fs';

const teardown = async () => {
  rm('./tests/integration/projects/dataclass-test-project/dataclasses/temp', { force: true, recursive: true }, () => {});
};

export default teardown;