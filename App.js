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

   //Solicitando permissão da galeria
  useEffect(()=>{
    if(permissaoMedia===null) return;
    if(!permissaoMedia?.granted){
      requestPermissaoMedia()
    }

  },[])

    

  //Função de tirar foto
  const tirarFoto = async()=>{
    if(cameraRef.current){
      const dadoFoto = await cameraRef.current.takePictureAsync()//Captura a imagem
      setFoto(dadoFoto)//Armazena no estado
    }
  }

  //Função para salvar a foto
  const salvarFoto = async ()=>{
    if(foto?.uri){
      await MediaLibrary.createAssetAsync(foto.uri)
      Alert.alert("Sucesso","Foto salva na galeria")
      setFoto(null) //Reseta o estado
    }
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
