'use strict';
import StoreBoilerplate from './store-boilerplate';
import Immutable from 'immutable';

var defaultPositionState = {
  xScrollChangePosition: 0,
  yScrollChangePosition: 0,
  renderedStartDisplayIndex: 0,
  renderedEndDisplayIndex: 10,
  tableHeight: 400,
  tableWidth: 200,
  rowHeight: 25,
  defaultColumnWidth: 80,
  infiniteScrollLoadTreshold: 50
};

const PositionPlugin  = {
  initializeState(state) {
    //default state modifications for this plugin
    return state
      .set('position', Immutable.fromJS(defaultPositionState))
      .set('renderedData', Immutable.fromJS([]));
  },

  RegisteredCallbacks: {
    XY_POSITION_CHANGED(action, state, store) {
      state = PositionPlugin.updatePositionProperties(action, state, store);
      return state ? PositionPlugin.updateRenderedData(state, store) : null;
    }
  },

  PrePatches: {
    GRIDDLE_LOADED_DATA(action, state, store) {
      return PositionPlugin.updateRenderedData(state, store);
    },
    GRIDDLE_NEXT_PAGE(action, state, store) {
      return PositionPlugin.updateRenderedData(state, store);
    },
    GRIDDLE_PREVIOUS_PAGE(action, state, store) {
      return PositionPlugin.updateRenderedData(state, store);
    },
    GRIDDLE_FILTERED(action, state, store) {
      return PositionPlugin.updateRenderedData(state, store);
    },
    GRIDDLE_SORT(action, state, store) {
      return PositionPlugin.updateRenderedData(state, store);
    }
  },

  Helpers: {
    getRenderedData() {
      return this.state.get('renderedData');
    }
  },

  shouldUpdateDrawnRows(action, state) {
    let yScrollChangePosition = state.getIn(['position', 'yScrollChangePosition']);
    let rowHeight = state.getIn(['position', 'rowHeight']);

    return Math.abs(action.yScrollPosition - yScrollChangePosition) >= rowHeight;
  },

  updatePositionProperties(action, state, store) {
    if (!PositionPlugin.shouldUpdateDrawnRows(action, state)) {
      return null; // Indicate that this shouldn't result in an emit.
    }
    let rowHeight = state.getIn(['position', 'rowHeight']);
    let tableHeight = state.getIn(['position', 'tableHeight']);

    var adjustedHeight = rowHeight;
    var visibleRecordCount = Math.ceil(tableHeight / adjustedHeight);

    // Inspired by : http://jsfiddle.net/vjeux/KbWJ2/9/
    let renderedStartDisplayIndex = Math.max(0, Math.floor(action.yScrollPosition / adjustedHeight) - visibleRecordCount * 0.25);
    let renderedEndDisplayIndex = Math.min(renderedStartDisplayIndex + visibleRecordCount * 1.25, store.getVisibleData().length - 1) + 1;

    return state
      .setIn(['position', 'renderedStartDisplayIndex'], renderedStartDisplayIndex)
      .setIn(['position', 'renderedEndDisplayIndex'], renderedEndDisplayIndex)
      .setIn(['position', 'yScrollChangePosition'], action.yScrollPosition)
      .setIn(['position', 'xScrollChangePosition'], action.xScrollPosition);
  },

  updateRenderedData(state, store) {
    let startDisplayIndex = state.getIn(['position', 'renderedStartDisplayIndex']); // -1
    return state
      .set('renderedData', store.getVisibleData()
                            .skip(startDisplayIndex)
                            .take(state.getIn(['position', 'renderedEndDisplayIndex']) - startDisplayIndex));
  }
}

export default PositionPlugin;
