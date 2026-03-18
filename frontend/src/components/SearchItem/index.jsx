import { useState, useEffect, useRef } from 'react';

import useDebounce from '@/hooks/useDebounce';

import { Select, Empty } from 'antd';

import { SearchOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { crud } from '@/redux/crud/actions';

import { useCrudContext } from '@/context/crud';
import { selectSearchedItems } from '@/redux/crud/selectors';

function SearchItemComponent({ config, onRerender }) {
  const { entity, searchConfig } = config;
  const { displayLabels, searchFields, outputValue = '_id' } = searchConfig;

  const dispatch = useDispatch();
  const { crudContextAction } = useCrudContext();
  const { panel, collapsedBox, readBox } = crudContextAction;
  const { result, isLoading, isSuccess } = useSelector(selectSearchedItems);

  const [selectOptions, setOptions] = useState([]);
  const [currentValue, setCurrentValue] = useState(undefined);
  const [valToSearch, setValToSearch] = useState('');
  const debouncedValue = useDebounce(valToSearch, 500);

  const labels = (optionField) => {
    return displayLabels.map((x) => optionField[x]).join(' ');
  };

  useEffect(() => {
    if (debouncedValue) {
      const options = {
        q: debouncedValue,
        fields: searchFields,
      };
      dispatch(crud.search({ entity, options }));
    }
  }, [debouncedValue, entity, searchFields, dispatch]);

  const onSearch = (searchText) => {
    setValToSearch(searchText);
    if (!searchText) {
      setOptions([]);
    }
  };

  const onSelect = (data) => {
    const currentItem = result.find((item) => item[outputValue] === data);
    dispatch(crud.currentItem({ data: currentItem }));
    panel.open();
    collapsedBox.open();
    readBox.open();
    onRerender();
  };

  useEffect(() => {
    if (isSuccess && valToSearch) {
      setOptions(result);
    }
  }, [isSuccess, result, valToSearch]);

  return (
    <Select
      loading={isLoading}
      showSearch
      allowClear
      placeholder={<SearchOutlined style={{ float: 'right', padding: '10px 0' }} />}
      defaultActiveFirstOption={false}
      filterOption={false}
      notFoundContent={isLoading ? '... Searching' : <Empty />}
      value={currentValue}
      onSearch={onSearch}
      style={{ width: '100%' }}

      onSelect={onSelect}
      className="search-input-premium"
      popupClassName="search-popup-midnight"
    >
      {selectOptions.map((optionField) => (
        <Select.Option key={optionField[outputValue]} value={optionField[outputValue]}>
          {labels(optionField)}
        </Select.Option>
      ))}
    </Select>
  );
}


export default function SearchItem({ config }) {
  const [state, setState] = useState([0]);

  const onRerender = () => {
    setState([state + 1]);
  };

  return state.map((comp) => (
    <SearchItemComponent key={comp} config={config} onRerender={onRerender} />
  ));
}
