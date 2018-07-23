const { SchemaDirectiveVisitor } = require('graphql-tools');
const { defaultFieldResolver } = require('graphql');

class AuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    this.wrapField(field);
  }
  visitObject(type) {
    const fields = type.getFields();
    Object.keys(fields).forEach(fieldName => this.wrapField(fields[fieldName]));
  }

  wrapField(field) {
    const { resolve = defaultFieldResolver } = field;
    const skip = this.args.skip;
    field.resolve = async (parent, args, context, info) => {
      if (!context.user && !skip) throw new Error('Authentication required');
      const result = await resolve(parent, args, context, info);
      return result;
    };
  }
}

module.exports = AuthDirective;
