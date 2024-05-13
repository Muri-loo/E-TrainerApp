import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navbarlight from '../Navigation/navbarlight';
import Fundo from '../Navigation/fundo';
import { View, Text, StyleSheet } from 'react-native';
import IconFA from 'react-native-vector-icons/FontAwesome';
import MapView, { Marker } from 'react-native-maps';

function CustomerService({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <Navbarlight navigation={navigation} />
      <View style={styles.content}>
        <Text style={styles.heading}>Contacte-nos: </Text>
        <Text style={styles.description}>
          Estamos aqui para ajudar! Pode contactar a nossa equipa de apoio ao cliente pelos seguintes meios:
        </Text>
        <View style={styles.contactItem}>
          <IconFA name={"phone"} size={25} color="#007bff" style={styles.icon} />
          <Text style={styles.contactText}>Telefone: +351 919 250 784</Text>
        </View>
        <View style={styles.contactItem}>
          <IconFA name={"envelope"} size={25} color="#007bff" style={styles.icon} />
          <Text style={styles.contactText}>Email: SuporteCliente@E-Trainer.pt</Text>
        </View>
        <View style={styles.contactItem}>
          <IconFA name={"globe"} size={25} color="#007bff" style={styles.icon} />
          <Text style={styles.contactText}>Website: www.bhout.com</Text>
        </View>
        <Text style={styles.additionalInfo}>Também pode visitar a nossa secção de Perguntas Frequentes no nosso site .</Text>
        <Text style={styles.additionalInfo}>Para consultas comerciais, por favor contacte a nossa equipa de vendas.</Text>
        <View style={styles.mapContainer}>
          <Text style={styles.locationText}>Localização dos nossos escritórios: </Text>
          <MapView style={styles.map} initialRegion={{
            latitude: 38.74785225551356,
            longitude: -9.156006623634358,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}>
          
            <Marker
              coordinate={{
                latitude: 38.74794005777725,
                longitude: -9.153238584223159,
              }}
              title="Iscte - Instituto Universitário de Lisboa"
            />
          </MapView>
        </View>
      </View>
      <Fundo navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#007bff',
    textAlign: 'left',
  },
  description: {
    marginBottom: 20,
    color: '#333',
    textAlign: 'left',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  contactText: {
    marginLeft: 10,
    fontSize: 18,
    color: '#333',
  },
  icon: {
    marginRight: 10,
  },
  additionalInfo: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
    textAlign: 'left',
  },
  mapContainer: {
    flex: 1,
    marginBottom: 20,
  },
  locationText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'left',
  },
  map: {
    flex: 1,
  },
});

export default CustomerService;
