import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Alert,Image } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import * as Sharing from 'expo-sharing';

//Importe dos components de camera
import { CameraView, useCameraPermissions } from 'expo-camera';

//Biblioteca para salvar a foto na galeria do dispositivo
import * as MediaLibrary from "expo-media-library"



export default function App() {
  //Estado de permissão da camera
  const [permissaoCam, requestPermissaoCam] = useCameraPermissions()

  //Estado de permissão da biblioteca de imagens
  const [permissaoMedia, requestPermissaoMedia] = MediaLibrary.usePermissions()

  //Refêrencia da câmera
  const cameraRef = useRef(null)

  //Estado da foto capturada
  const [foto, setFoto] = useState(null)

  //Estado para alternar entre a câmera front e traseira
  const[isFrontCamera,setIsFrontCamera]=useState(false)

  //Estado para gerenciamento do flash(câmera)
  const[flashLigado,setFlashLigado]=useState(false)

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

  //Função para compartilhar a foto tirada
  const compartilharFoto = async ()=>{
    if(foto?.uri && await Sharing.isAvailableAsync()){
      await Sharing.shareAsync(foto.uri)//Passa a foto para compartilhamento
    }else{
      Alert.alert("Erro","Não foi possível compartilhar a foto.")
    }
  }

  //Função para alternar entre as câmeras
  const toggleCameraType = () =>{
    setIsFrontCamera(!isFrontCamera)
  }

  //Função para alternar o flash(on/off)
  const alternarFlash = ()=>{
    setFlashLigado(!flashLigado)
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
      {!foto ? (
        <>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={isFrontCamera?'front':'back'}
          flash={flashLigado?"on":"off"}
        />
        <Button title='Tirar Foto' onPress={tirarFoto} />
        <Button title='Alternar Câmera' onPress={toggleCameraType}/>
        <Button 
            title={flashLigado?"Desligar Flash":"Ligar Flash"}
            onPress={alternarFlash}
        />
        </>
      ):(
        <>
          <Image source={{uri:foto.uri}} style={styles.preview}/>
          <Button title='Salvar Foto' onPress={salvarFoto}/>
          <Button title='Tirar outra foto' onPress={()=>setFoto(null)}/>  
          <Button title="Compartilhar foto" onPress={compartilharFoto} />
        </>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  camera: { flex: 1 },
  preview:{
    flex:1,
    resizeMode:"cover"
  }
});
