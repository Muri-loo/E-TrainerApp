import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, StyleSheet, TouchableOpacity, Button, Image } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons';
import IconMI from 'react-native-vector-icons/MaterialIcons';
import IconFA from 'react-native-vector-icons/FontAwesome5';

const FormRegisterPhysic = ({ navigation, route }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: 'Iniciante', value: 'Iniciante' },
    { label: 'Intermédio', value: 'Intermédio' },
    { label: 'Avançado', value: 'Avançado' },
    { label: 'Profissional', value: 'Profissional' }
  ]); 

  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);

    // Format the date as YYYY-MM-DD
    const formattedDate =
      ('0' + currentDate.getDate()).slice(-2) + '/' +
      ('0' + (currentDate.getMonth() + 1)).slice(-2) + '/' + //fico com os ultimos 2 numeros 012 = 12 01 = 01
      currentDate.getFullYear();

    // Update the profile state with the formatted date
    setProfile((prevProfile) => ({
      ...prevProfile,
      dataNascimento: formattedDate
    }));
  };

  const showDatepicker = () => {
    setShow(true);
  };

  const handleContinue = () => {
    // Check if all required fields are filled
    if (profile.genero && profile.altura && profile.peso && profile.dataNascimento && profile.nivelFisico) {
      const today = new Date();
      if (date > today) {
        alert("A Data selecionada é no future. Escolhe uma data valida.");
      } else {
        navigation.navigate('ChooseGoals', { profile });
      }
    } else {
      // Not all fields are filled, show an alert or message
      alert('Por favor, preencha todos os campos antes de continuar.');
    }
  };

  const [profile, setProfile] = useState({
    nome: '',
    email: '',
    password: '',
    telemovel: '',
    altura: '',
    peso: '',
    genero: '',
    dataNascimento: '',
    fotoAtleta: '',
    nomeFotoAtleta: '',
    idAtleta: '',
    idTreinador: '',
    nivelFisico: '',
  });

  useEffect(() => {
    if (route.params) {
      setProfile(route.params.profile);
    }
  }, []);

  const handleProfileChange = (name, value) => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value
    }));
  };

  console.log(profile);

  // Generate heights array
  const heights = [];
  for (let i = 140; i <= 210; i++) {
    heights.push(i);
  }

  // Generate weights array
  const weights = [];
  for (let i = 35; i <= 210; i++) {
    weights.push(i);
  }
  const genders = ['Masculino', 'Feminino'];

  return (
    <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image style={{ width: 50, height: 50,}} source={{ uri: 'https://drive.google.com/uc?export=view&id=1KN_MSCsm1L8sp81rfyJv5eFKqhyy-0Wm' }} />
        </TouchableOpacity>
      <Text style={styles.header}>  Conta-nos mais sobre ti.</Text>
      <Text style={styles.subHeader}>
            Para proporcionar os melhores treinos possíveis, preenche este formulário com os teus dados.
        </Text>

      <Text style={styles.label}>Sexo:</Text>
      <ScrollView horizontal={true} contentContainerStyle={styles.scrollViewContainer}>
        {genders.map((gender, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.iconContainer,
              profile.genero === gender && styles.selectedIconContainer
            ]}
            onPress={() => handleProfileChange('genero', gender)}
          >
            <IconMC
              name={gender === 'Masculino' ? 'gender-male' : 'gender-female'}
              size={30}
              color={profile.genero === gender ? '#CC2C02' : '#fff'}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.label}>Data nascimento:</Text>
      <TouchableOpacity onPress={showDatepicker}>
        <Image style={{ width: 50, height: 50 }} source={{ uri: 'https://drive.google.com/uc?export=view&id=1ALnSAMWcnXD6LthpeSyCGoLApn4dhO9m' }} />
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          display="default"
          onChange={onChange}
        />
      )}
      <Text style={styles.label}>Data selecionada: <Text style={{ color: '#CC2C02' }}>{profile.dataNascimento}</Text></Text>

      <Text style={styles.label}>Altura(Cm):</Text>
      <ScrollView horizontal={true} contentContainerStyle={styles.scrollViewContainer}>
        {heights.map((height, index) => (
          <Text
            style={profile.altura === height ? [styles.numberText, styles.selectedText] : [styles.numberText]}
            key={index}
            onPress={() => handleProfileChange('altura', height)}>
            {height}
          </Text>
        ))}
      </ScrollView>

      <Text style={styles.label}>Peso(Kg):</Text>
      <ScrollView horizontal={true} contentContainerStyle={styles.scrollViewContainer}>
        {weights.map((weight, index) => (
          <Text
            style={profile.peso === weight ? [styles.numberText, styles.selectedText] : [styles.numberText]}
            key={index}
            onPress={() => handleProfileChange('peso', weight)}>
            {weight}
          </Text>
        ))}
      </ScrollView>

      <Text style={styles.label}>Nivel Atividade Fisica:</Text>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}  // Update the value in DropDownPicker
        setItems={setItems}
        onChangeValue={(val) => handleProfileChange('nivelFisico', val)}
        placeholder="Escolha uma opção"  // Defina a mensagem padrão aqui

      />

      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensures that container takes up all available space
    backgroundColor: '#000', // Dark background
    paddingHorizontal: 10, // Padding on the sides
    position: 'relative',
  },
  header: {
    fontSize: 24, // Set the size of your header text
    fontWeight: '600', // Set the weight of your header text
    color: '#fff', // White text color
    textAlign: 'center', // Center align text
    marginTop: '25%', // Space from the top
    marginBottom: 10, // Space below the header
  },
  subHeader: {
    fontSize: 16, // Set the size of your subHeader text
    fontWeight: '600', // Set the weight of your subHeader text
    color: '#fff', // White text color
    textAlign: 'center', // Center align text
    marginBottom: 20, // Space below the subHeader
  },
  label: {
    fontSize: 18, // Set the size of your label text
    fontWeight: '600', // Set the weight of your label text
    color: '#fff', // White text color
    marginBottom: 8, // Space below the label
    marginTop: 0,
  },
  scrollViewContainer: {
    flexDirection: 'row',
    maxHeight: 100,
  },
  numberText: {
    color: '#fff',
    textAlign: 'center',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 28,
    paddingHorizontal: 4, // No horizontal padding
    paddingVertical: 2, // No vertical padding
  },
  selectedText: {
    color: '#CC2C02',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
  selectedIconContainer: {
    borderColor: '#CC2C02',
  },
  button: {
    backgroundColor: '#CC2C02', // Red background color for the button
    paddingVertical: 12, // Vertical padding
    paddingHorizontal: 20, // Horizontal padding
    borderRadius: 20, // Rounded corners
    alignSelf: 'center', // Center the button
    marginTop: 20, // Space from the top
    marginBottom: 20, // Space from the bottom
  },
  buttonText: {
    fontSize: 20, // Set the size of your button text
    fontWeight: '600', // Set the weight of your button text
    color: '#fff', // White text color
    textAlign: 'center', // Center align text
  },
});

export default FormRegisterPhysic;
