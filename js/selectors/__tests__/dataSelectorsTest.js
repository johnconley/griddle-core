import Immutable from 'immutable';
import * as selectors from '../dataSelectors';
import sortUtils from '../../utils/sortUtils';

function getBasicState() {
  return Immutable.fromJS({
    data: [
      { one: 'one', two: 'two' },
      { one: 'three', two: 'four' }
    ],
    pageProperties: {
      property1: 'one',
      property2: 'two',
      pageSize: 1,
      currentPage: 0,
      maxPage: 2
    },
    sortColumns: [],
    sortDirections: []
  });
}

function withRenderProperties(state) {
  return state.set('renderProperties', new Immutable.fromJS({
      columnProperties: {
        one: { id: 'one', displayName: 'One', order: 2 },
        two: { id: 'two', displayName: 'Two', order: 1 }
      }
    })
  )
}

export function get3ColState() {
  return Immutable.fromJS({
    data: [
      { one: 'one', two: 'two', three: 'three' },
      { one: 'four', two: 'five', three: 'six' }
    ],
    pageProperties: {
      property1: 'one',
      property2: 'two',
      pageSize: 1,
      currentPage: 0,
      maxPage: 2
    },
    sortColumns: [],
    sortDirections: []
  });
}

describe('dataSelectors', () => {
  var initialState;

  beforeEach(() => {
    initialState = new Immutable.Map();
  })

  it('gets data', () => {
    const state = initialState.set('data', 'hi');
    expect(selectors.dataSelector(state)).toEqual('hi');
  })

  it('gets pageSize', () => {
    const state = initialState.setIn(['pageProperties', 'pageSize'], 20);
    expect(selectors.pageSizeSelector(state)).toEqual(20);
  })

  describe('hasNextSelector', () => {
    it('gets true when there are more possible pages', () => {
      const state = getBasicState()
        .setIn(['pageProperties', 'currentPage'], 1)
        .setIn(['pageProperties', 'maxPage'], 5);

      expect(selectors.hasNextSelector(state)).toEqual(true);
    })

    it('gets false when no more possible pages', () => {
      const state = getBasicState()
        .setIn(['pageProperties', 'currentPage'], 5)

      expect(selectors.hasNextSelector(state)).toEqual(false);
    })
  })

  describe('hasPreviousSelector', () => {
    it('gets true when there are previous pages', () => {
      const state = initialState
        .setIn(['pageProperties', 'currentPage'], 5);

      expect(selectors.hasPreviousSelector(state)).toEqual(true);
    })

    it('gets false when no previous pages', () => {
      const state = initialState
        .setIn(['pageProperties', 'currentPage'], 1);

      expect(selectors.hasPreviousSelector(state)).toEqual(false);
    })
  })

  it('gets current page', () => {
    const state = initialState.setIn(['pageProperties', 'currentPage'], 5);
    expect(selectors.currentPageSelector(state)).toEqual(5);
  });

  it('gets max page', () => {
    const state = getBasicState();
    expect(selectors.maxPageSelector(state)).toEqual(2);
  })

  it('gets filter', () => {
    const state = initialState.set('filter', 'filtered');
    expect(selectors.filterSelector(state)).toEqual('filtered');
  });

  it('gets empty string when no filter present', () => {
    const state = initialState;
    expect(selectors.filterSelector(state)).toEqual('');
  })

  describe ('with metadata columns', () => {
    it('gets metadata columns', () => {
      const state = get3ColState().set('metadataColumns', Immutable.List(['two']));
      const metaDataColumns = selectors.metaDataColumnsSelector(state);
      expect(metaDataColumns.toJSON()).toEqual(['two'])
    })
  })
})