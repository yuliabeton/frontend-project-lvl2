import _ from 'lodash';

const makeIndent = (depth) => '  '.repeat(depth);

const formatValue = (value, depth = 1) => {
  if (_.isObject(value)) {
    const keys = Object.keys(value);
    const formattedKeys = keys.map((key) => `${key}: ${formatValue(value[key], depth + 1)}`);
    const result = formattedKeys.join(`\n${makeIndent(depth)}`);
    return `{\n${makeIndent(depth)}${result}\n${makeIndent(depth)}}`;
  }
  return value;
};

const stylish = (tree) => {
  const iter = (diff, depth = 1) => {
    const getFormattedNode = (node) => {
      switch (node.type) {
        case 'parent': {
          const children = iter(node.children, depth + 1);
          return `${makeIndent(depth + 1)}${node.name}: ${children}`;
        }
        case 'added': {
          return `${makeIndent(depth)}+ ${node.name}: ${formatValue(node.value, depth + 1)}`;
        }
        case 'removed': {
          return `${makeIndent(depth)}- ${node.name}: ${formatValue(node.value, depth + 1)}`;
        }
        case 'unchanged': {
          return `${makeIndent(depth)}  ${node.name}: ${formatValue(node.value, depth + 1)}`;
        }
        case 'updated': {
          return `${makeIndent(depth)}- ${node.name}: ${formatValue(node.removedValue, depth + 1)}\n${makeIndent(depth)}+ ${node.name}: ${formatValue(node.addedValue, depth + 1)}`;
        }
        default:
          throw Error(node.type);
      }
    };
    const formattedNodes = diff.map((el) => getFormattedNode(el));
    const result = formattedNodes.join('\n');
    return `{\n${result}\n${makeIndent(depth - 1)}}`;
  };
  return iter(tree);
};
export default stylish;
