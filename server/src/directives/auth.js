const { SchemaDirectiveVisitor } = require('graphql-tools');
const { defaultFieldResolver } = require('graphql');

class AuthDirective extends SchemaDirectiveVisitor {
  visitObject(type) {
    this.wrappObject(type);
  }

  visitFieldDefinition(field, details) {
    this.wrappField(field, details.objectType);
  }

  wrappField(field, objectType) {
    if (objectType._authWrapped) return;
    objectType._authWrapped = true;
    const { resolve = defaultFieldResolver } = field;
    field.resolve = (...args) => {
      if (args[2].user) return resolve.apply(this, args);

      throw new Error('Requires Authentication');
    };
  }

  wrappObject(objectType) {
    const fields = objectType.getFields();
    const keys = Object.keys(fields);
    keys.forEach(fieldName => {
      const field = fields[fieldName];
      this.wrappField(field, objectType);
    });
  }
}

module.exports = AuthDirective;
