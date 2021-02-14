import React, {useEffect, useState} from 'react';
import moment from 'moment';
import {fetchConfig} from 'utils/Fetch';
import {Text, View, ScrollView, TouchableOpacity, Alert} from 'react-native';
import {ActivityIndicator, FAB} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
const intervals = 3;

const Calendar = ({refresh}) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [range, setRange] = useState([
    moment().startOf('week'),
    moment().endOf('week'),
  ]);

  const [docs, setDocs] = useState([]);

  const load = async () => {
    setLoading(true);
    const {url, headers} = await fetchConfig();

    fetch(
      `${url}tareas/?fi=${range[0].format('YYYY-MM-DD')}&ff=${range[1].format(
        'YYYY-MM-DD',
      )}`,
      {
        headers,
      },
    )
      .then((r) => r.json())
      .then((tareas) => {
        setLoading(false);
        console.log(tareas);
        setDocs(tareas);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const next = (plus) => {
    setRange([range[0].add(plus, 'week'), range[1].add(plus, 'week')]);
  };

  const trash = (item) => {
    Alert.alert(
      '¿Desea eliminar la tarea?',
      '',
      [
        {
          text: 'Conservar',
          onPress: () => console.log('Conservar'),
          style: 'cancel',
        },
        {text: 'Eliminar', onPress: () => this.props.taskRemove(item.id)},
      ],
      {cancelable: false},
    );
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (refresh) {
      load();
    }
  }, [refresh]);

  useEffect(() => {
    load();
  }, [range]);

  return (
    <>
      <Text style={{fontFamily: 'Mont-Bold'}}>Calendario</Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 8,
          marginBottom: 16,
        }}>
        <FAB icon="arrow-left" small color="#ffff" onPress={() => next(-1)} />
        <Text style={{fontFamily: 'Mont-Regular', fontSize: 14}}>
          {range[0].format('YYYY-MM-DD')}
        </Text>
        <Text style={{fontFamily: 'Mont-Regular', fontSize: 14}}>
          {range[1].format('YYYY-MM-DD')}
        </Text>
        <FAB icon="arrow-right" small color="#ffff" onPress={() => next(1)} />
      </View>
      <View style={{width: '100%'}}>
        {loading && <ActivityIndicator />}
        {!loading && docs.length == 0 && (
          <Text
            style={{
              fontFamily: 'Mont-Regular',
              fontSize: 12,
              textAlign: 'center',
            }}>
            No hay tareas
          </Text>
        )}
        <ScrollView
          horizontal={true}
          contentContainerStyle={{width: `${100 * intervals}%`}}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={200}
          decelerationRate="fast"
          pagingEnabled>
          {docs.map((doc) => (
            <TouchableOpacity
              style={{
                width: '15%',
                height: '100%',
                backgroundColor: 'rgba(84,4,118,.05)',
                marginRight: 8,
                padding: 8,
                borderRadius: 4,
              }}
              onLongPress={() => trash(doc)}
              onPress={() =>
                navigation.push('TaskSave', {
                  id: doc.id,
                  cliente_id: '',
                  reload: load,
                })
              }>
              <Text style={{fontFamily: 'Mont-Regular', fontSize: 12}}>
                {moment(doc.fecha_agendamiento).format('dddd hh:mm a')}
              </Text>
              <Text style={{fontFamily: 'Mont-Regular', fontSize: 10}}>
                {doc.tipo_tarea_str}, {doc.cliente_str}.
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </>
  );
};

export default Calendar;
