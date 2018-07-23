function __resolveType(obj, context, info) {
  return obj.__typename;
}

module.exports = {
  __resolveType,
};
