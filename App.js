import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,Button,Alert } from 'react-native';
import { useState,useEffect,useRef } from 'react';

//Importe dos components de camera
import { CameraView,useCameraPermissions } from 'expo-camera';

//Biblioteca para salvar a foto na galeria do dispositivo
import * as MediaLibrary from "expo-media-library"



export default function App() {
  //Estado de permissão da camera
  const[permissaoCam,requestPermissaoCam] = useCameraPermissions()

  //Estado de permissão da biblioteca de imagens
  const[permissaoMedia,requestPermissaoMedia]= MediaLibrary.usePermissions()

  //Refêrencia da câmera
  const cameraRef = useRef(null)

  //Estado da foto capturada
  const[foto,setFoto] = useState(null)

   //Solicitar permissão para acessar a galeria no inicio do app
  useEffect(() => {
    if (permissaoMedia === null) return;
    if (!permissaoMedia?.granted) {
      requestPermissaoMedia()
    }
  }, [])

    

   //Função para tirar foto
  const tirarFoto = async () => {
    if (cameraRef.current) {
      const dadoFoto = await cameraRef.current.takePictureAsync(); //captura foto
      setFoto(dadoFoto)//Salva Estado
    }
  }

  const salvarFoto = async () => {
    try {
      await MediaLibrary.createAssetAsync(foto.uri)//Salvar a foto na galeria
      Alert.alert("Sucesso", "Foto salva com suceso!")
      setFoto(null) //Reseta o estado para eu tirar uma foto
    } catch (err) {
      Alert.alert("Error", "Error ao Salvar Foto.")
    }
  }
 
  //Enquanto a permissão não estiver carregada
  if (!permissaoCam) return <View />

  if (!permissaoCam.granted) {
    return (
      <View>
        <Text>Permissão da câmera não foi concedida</Text>
        <Button title='Permitir' onPress={requestPermissaoCam} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
     <Text>Teste</Text>
       <CameraView 
          ref={cameraRef}
          style={styles.camera}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  camera:{flex:1}
});
