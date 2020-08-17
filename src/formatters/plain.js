const formatValue = (value) => {
  if (typeof value === 'object') {
    return '[complex value]';
  }
  if (typeof value === 'string') {
    return `'${value}'`;
  }
  return value;
};

const plainFormatter = (tree) => {
  const iter = (tree, paths = []) => {
    const formatType = (node) => {
      const newPaths = [...paths, node.name];
      const fullPath = newPaths.join('.');

      if (node.type === 'parent') {
        const children = iter(node.children, newPaths);
        return `${children}`;
      }
      if (node.type === 'removed') {
        return `Property '${fullPath}' was removed`;
      } if (node.type === 'added') {
        return `Property '${fullPath}' was added with value: ${formatValue(node.value)}`;
      } if (node.type === 'updated') {
        return `Property '${fullPath}' was updated. From ${formatValue(node.removedValue)} to ${formatValue(node.addedValue)}`;
      }
    };
    const formattedNodes = tree.map((el) => formatType(el));
    const result = formattedNodes.join('\n');
    return result;
  };
  return iter(tree);
};
export default plainFormatter;
