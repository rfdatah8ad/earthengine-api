/**
 * @fileoverview A wrapper for Lists.
 */

goog.provide('ee.List');

goog.require('ee.ApiFunction');
goog.require('ee.ComputedObject');
goog.require('ee.CustomFunction');
goog.require('goog.array');



/**
 * Constructs a new list.
 *
 * @param {goog.array.ArrayLike|Object} list A list or a computed object.
 *
 * @constructor
 * @extends {ee.ComputedObject}
 * @export
 */
ee.List = function(list) {
  // Constructor safety.
  if (!(this instanceof ee.List)) {
    return ee.ComputedObject.construct(ee.List, arguments);
  } else if (list instanceof ee.List) {
    return list;
  }

  ee.List.initialize();

  /**
   * The internal rerpresentation of this list.
   *
   * @type {goog.array.ArrayLike?}
   * @private
   */
  this.list_;

  if (goog.isArray(list)) {
    goog.base(this, null, null);
    this.list_ = /** @type {goog.array.ArrayLike} */ (list);
  } else if (list instanceof ee.ComputedObject) {
    goog.base(this, list.func, list.args, list.varName);
    this.list_ = null;
  } else {
    throw Error('Invalid argument specified for ee.List(): ' + list);
  }
};
goog.inherits(ee.List, ee.ComputedObject);


/**
 * Whether the class has been initialized with API functions.
 * @type {boolean}
 * @private
 */
ee.List.initialized_ = false;


/** Imports API functions to this class. */
ee.List.initialize = function() {
  if (!ee.List.initialized_) {
    ee.ApiFunction.importApi(ee.List, 'List', 'List');
    ee.List.initialized_ = true;
  }
};


/** Removes imported API functions from this class. */
ee.List.reset = function() {
  ee.ApiFunction.clearApi(ee.List);
  ee.List.initialized_ = false;
};


/**
 * @inheritDoc
 */
ee.List.prototype.encode = function(opt_encoder) {
  if (goog.isArray(this.list_)) {
    return goog.array.map(this.list_, function(elem) {
      return opt_encoder(elem);
    });
  } else {
    return goog.base(this, 'encode', opt_encoder);
  }
};


/**
 * @inheritDoc
 */
ee.List.prototype.name = function() {
  return 'List';
};


/**
 * Maps an algorithm over a list.
 *
 * @param {function(Object):Object} algorithm The operation to map over
 *     the items in the list. A JavaScript function that receives an object
 *     and returns one. The function is called only once and the result is
 *     captured as a description, so it cannot perform imperative operations
 *     or rely on external state.
 * @return {ee.List} The mapped list.
 * @export
 */
ee.List.prototype.map = function(algorithm) {
  if (!goog.isFunction(algorithm)) {
    throw Error('Can\'t map non-callable object: ' + algorithm);
  }
  var signature = {
    'name': '',
    'returns': 'Object',
    'args': [{
      'name': null,
      'type': 'Object'
    }]
  };
  return this.castInternal(ee.ApiFunction._apply('List.map', {
    'list': this,
    'baseAlgorithm': new ee.CustomFunction(signature, algorithm)
  }));
};