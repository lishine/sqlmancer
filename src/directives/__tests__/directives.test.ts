import {
  validateSchema,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList,
} from 'graphql'

import { schema } from './__fixtures__/schema'

describe('directives', () => {
  beforeAll(() => {
    validateSchema(schema).forEach((error) => {
      throw error
    })
  })

  describe('@private', () => {
    test('correct usage', async () => {
      await new Promise((resolve) => process.nextTick(resolve))
      expect(schema.getType('Secret')).toBeUndefined()
      expect((schema.getType('Widget') as GraphQLObjectType).getFields().privateField).toBeUndefined()
    })
  })

  describe('@limit', () => {
    test('correct usage', () => {
      const field = schema.getQueryType()!.getFields().widgets!
      const argument = field.args.find((arg) => arg.name === 'limit')
      expect(argument).toBeDefined()
      expect(argument!.type).toBe(GraphQLInt)
    })
  })

  describe('@offset', () => {
    test('correct usage', () => {
      const field = schema.getQueryType()!.getFields().widgets!
      const argument = field.args.find((arg) => arg.name === 'offset')
      expect(argument).toBeDefined()
      expect(argument!.type).toBe(GraphQLInt)
    })
  })

  describe('@where', () => {
    test('correct usage', () => {
      const field = schema.getQueryType()!.getFields().widgets!
      const argument = field.args.find((arg) => arg.name === 'where')
      const type = argument!.type as GraphQLInputObjectType
      const fields = type.getFields()
      expect(fields.id.type.toString()).toStrictEqual('IDOperators')
      expect(fields.idNullable.type.toString()).toStrictEqual('IDOperators')
      expect(fields.idList.type.toString()).toStrictEqual('IDListOperators')
      expect(fields.string.type.toString()).toStrictEqual('StringOperators')
      expect(fields.stringNullable.type.toString()).toStrictEqual('StringOperators')
      expect(fields.stringList.type.toString()).toStrictEqual('StringListOperators')
      expect(fields.int.type.toString()).toStrictEqual('IntOperators')
      expect(fields.intNullable.type.toString()).toStrictEqual('IntOperators')
      expect(fields.intList.type.toString()).toStrictEqual('IntListOperators')
      expect(fields.float.type.toString()).toStrictEqual('FloatOperators')
      expect(fields.floatNullable.type.toString()).toStrictEqual('FloatOperators')
      expect(fields.floatList.type.toString()).toStrictEqual('FloatListOperators')
      expect(fields.boolean.type.toString()).toStrictEqual('BooleanOperators')
      expect(fields.booleanNullable.type.toString()).toStrictEqual('BooleanOperators')
      expect(fields.booleanList.type.toString()).toStrictEqual('BooleanListOperators')
      expect(fields.json.type.toString()).toStrictEqual('JSONOperators')
      expect(fields.jsonNullable.type.toString()).toStrictEqual('JSONOperators')
      expect(fields.jsonObject.type.toString()).toStrictEqual('JSONObjectOperators')
      expect(fields.jsonObjectNullable.type.toString()).toStrictEqual('JSONObjectOperators')
      expect(fields.enum.type.toString()).toStrictEqual('FlavorOperators')
      expect(fields.enumNullable.type.toString()).toStrictEqual('FlavorOperators')
      expect(fields.enumList.type.toString()).toStrictEqual('FlavorListOperators')
    })
  })

  describe('@orderBy', () => {
    test('correct usage', () => {
      const field = schema.getQueryType()!.getFields().widgets!
      const argument = field.args.find((arg) => arg.name === 'orderBy')
      const type = argument!.type as GraphQLList<GraphQLNonNull<GraphQLInputObjectType>>
      const fields = type.ofType.ofType.getFields()
      const sortDirectionEnum = schema.getType('SortDirection')
      expect(fields.id.type).toStrictEqual(sortDirectionEnum)
      expect(fields.idNullable.type).toStrictEqual(sortDirectionEnum)
      expect(fields.string.type).toStrictEqual(sortDirectionEnum)
      expect(fields.stringNullable.type).toStrictEqual(sortDirectionEnum)
      expect(fields.int.type).toStrictEqual(sortDirectionEnum)
      expect(fields.intNullable.type).toStrictEqual(sortDirectionEnum)
      expect(fields.float.type).toStrictEqual(sortDirectionEnum)
      expect(fields.floatNullable.type).toStrictEqual(sortDirectionEnum)
      expect(fields.boolean.type).toStrictEqual(sortDirectionEnum)
      expect(fields.booleanNullable.type).toStrictEqual(sortDirectionEnum)
      expect(fields.enum.type).toStrictEqual(sortDirectionEnum)
      expect(fields.enumNullable.type).toStrictEqual(sortDirectionEnum)
      expect(fields.idList).toBeUndefined()
      expect(fields.stringList).toBeUndefined()
      expect(fields.intList).toBeUndefined()
      expect(fields.floatList).toBeUndefined()
      expect(fields.booleanList).toBeUndefined()
      expect(fields.json).toBeUndefined()
      expect(fields.jsonNullable).toBeUndefined()
      expect(fields.jsonList).toBeUndefined()
      expect(fields.jsonObject).toBeUndefined()
      expect(fields.jsonObjectNullable).toBeUndefined()
      expect(fields.jsonObjectList).toBeUndefined()
      expect(fields.enumList).toBeUndefined()
    })
  })

  describe('@many', () => {
    test('correct usage', () => {
      const field = schema.getQueryType()!.getFields().someMoreWidgets!
      expect(field.args.find((arg) => arg.name === 'where')).toBeDefined()
      expect(field.args.find((arg) => arg.name === 'orderBy')).toBeDefined()
      expect(field.args.find((arg) => arg.name === 'limit')).toBeDefined()
      expect(field.args.find((arg) => arg.name === 'offset')).toBeDefined()
    })
  })

  describe('@input', () => {
    test('correct usage', async () => {
      const { createWidget, createWidgets, updateWidget, updateWidgets } = (schema.getType(
        'Mutation'
      ) as GraphQLObjectType).getFields()
      const CreateWidgetInput = schema.getType('CreateWidgetInput') as GraphQLInputObjectType
      const UpdateWidgetInput = schema.getType('UpdateWidgetInput') as GraphQLInputObjectType
      const createWidgetInputArgType = createWidget.args.find((arg) => arg.name === 'input')!.type
      const createWidgetsInputArgType = createWidgets.args.find((arg) => arg.name === 'input')!.type
      const updateWidgetInputArgType = updateWidget.args.find((arg) => arg.name === 'input')!.type
      const updateWidgetsInputArgType = updateWidgets.args.find((arg) => arg.name === 'input')!.type
      expect(createWidgetInputArgType.toString()).toBe('CreateWidgetInput!')
      expect(createWidgetsInputArgType.toString()).toBe('[CreateWidgetInput!]!')
      expect(updateWidgetInputArgType.toString()).toBe('UpdateWidgetInput!')
      expect(updateWidgetsInputArgType.toString()).toBe('UpdateWidgetInput!')
      expect(CreateWidgetInput.getFields().id.type.toString()).toBe('ID')
      expect(CreateWidgetInput.getFields().idNullable.type.toString()).toBe('ID')
      expect(CreateWidgetInput.getFields().idList.type.toString()).toBe('[ID!]!')
      expect(CreateWidgetInput.getFields().string.type.toString()).toBe('String!')
      expect(CreateWidgetInput.getFields().json.type.toString()).toBe('JSON!')
      expect(UpdateWidgetInput.getFields().idNullable.type.toString()).toBe('ID')
      expect(UpdateWidgetInput.getFields().idList.type.toString()).toBe('[ID!]')
      expect(UpdateWidgetInput.getFields().string.type.toString()).toBe('String')
      expect(UpdateWidgetInput.getFields().json.type.toString()).toBe('JSON')
      expect(UpdateWidgetInput.getFields().id).toBeUndefined()
    })
  })

  describe('@paginate', () => {
    test('correct usage', async () => {
      const { createWidget, createWidgets, updateWidget, updateWidgets } = (schema.getType(
        'Mutation'
      ) as GraphQLObjectType).getFields()
      const CreateWidgetInput = schema.getType('CreateWidgetInput') as GraphQLInputObjectType
      const UpdateWidgetInput = schema.getType('UpdateWidgetInput') as GraphQLInputObjectType
      const createWidgetInputArgType = createWidget.args.find((arg) => arg.name === 'input')!.type
      const createWidgetsInputArgType = createWidgets.args.find((arg) => arg.name === 'input')!.type
      const updateWidgetInputArgType = updateWidget.args.find((arg) => arg.name === 'input')!.type
      const updateWidgetsInputArgType = updateWidgets.args.find((arg) => arg.name === 'input')!.type
      expect(createWidgetInputArgType.toString()).toBe('CreateWidgetInput!')
      expect(createWidgetsInputArgType.toString()).toBe('[CreateWidgetInput!]!')
      expect(updateWidgetInputArgType.toString()).toBe('UpdateWidgetInput!')
      expect(updateWidgetsInputArgType.toString()).toBe('UpdateWidgetInput!')
      expect(CreateWidgetInput.getFields().id.type.toString()).toBe('ID')
      expect(CreateWidgetInput.getFields().idNullable.type.toString()).toBe('ID')
      expect(CreateWidgetInput.getFields().idList.type.toString()).toBe('[ID!]!')
      expect(CreateWidgetInput.getFields().string.type.toString()).toBe('String!')
      expect(CreateWidgetInput.getFields().json.type.toString()).toBe('JSON!')
      expect(UpdateWidgetInput.getFields().idNullable.type.toString()).toBe('ID')
      expect(UpdateWidgetInput.getFields().idList.type.toString()).toBe('[ID!]')
      expect(UpdateWidgetInput.getFields().string.type.toString()).toBe('String')
      expect(UpdateWidgetInput.getFields().json.type.toString()).toBe('JSON')
      expect(UpdateWidgetInput.getFields().id).toBeUndefined()
    })
  })
})
