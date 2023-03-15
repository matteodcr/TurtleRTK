import {SectionList, Text} from 'react-native';
import React from 'react';
import {styles} from './CasterPoolScreen';
import {useStoreContext} from '../../../fc/Store';
import {observer} from 'mobx-react-lite';
import CasterListItem from './CasterListItem';

interface CasterListProps {
  showCasterInfo(Caster): void;
}
export default observer(function CasterList({showCasterInfo}: CasterListProps) {
  const store = useStoreContext();
  const renderCasterListItem = ({item}) => (
    <CasterListItem item={item} showCasterInfo={showCasterInfo} />
  );
  return (
    <SectionList
      sections={store.casterPool.formatData}
      keyExtractor={(item, index) => String(item) + index}
      renderItem={renderCasterListItem}
      renderSectionHeader={({section: {title}}) => (
        <Text style={styles.header}>{title}</Text>
      )}
    />
  );
});
