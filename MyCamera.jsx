import { Camera, CameraType, FlashMode } from 'expo-camera';
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, Modal, Alert, Image } from 'react-native';

const ModalPhoto = ({ isOpen, data, setData }) => {
  const [modalVisible, setModalVisible] = useState(isOpen)

  // console.log(modalVisible, 'aberto');
  console.log(data['uri']);

  return (
    <Modal
      animationType='slide'
      visible={isOpen}
      onRequestClose={() => {
        Alert.alert('Modal has been closed');
        setModalVisible(false)
        setData('')
      }}
    >
      <View style={{ display: 'flex', flex: 0, justifyContent: 'center', alignItems: 'center', padding: 5, marginTop: 20 }}>
        <Text>Foto:</Text>
        <Image source={{ uri: data['uri'] }} style={{ width: '100%', height: '86%', backgroundColor: '#333' }} resizeMode='contain' />
        <TouchableOpacity style={styles.button} onPress={() => {
          setModalVisible(false)
          setData('')
        }}>
          <Text style={styles.white}>Tirar outra foto</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  )
}

export default function () {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions(null);
  const [flash, setFlash] = useState(FlashMode.off);
  const [cameraRef, setCameraRef] = useState(null);
  const [isOpen, setOpen] = useState(false);
  const [data, setData] = useState('');

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync()
      requestPermission(status === 'granted')
    })();
  }, [])

  const toggleCameraType = () => {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back))
  }

  const handleFlashMode = () => {
    setFlash(currentFlash => currentFlash === FlashMode.on ? FlashMode.off : FlashMode.on)
  }

  // console.log(data);

  const takePicture = async (re) => {
    if (cameraRef && permission['granted']) {
      const picture = await cameraRef.takePictureAsync();
      setOpen(true)
      setData(picture)
    }
  }
  return (
    <View>
      <View>
        <Camera
          ref={ref => setCameraRef(ref)}
          type={type}
          style={styles.camera}
          flashMode={flash}>
          <View>
            <TouchableOpacity onPress={toggleCameraType} style={styles.button}>
              <Text style={styles.white}>Flip camera</Text>
            </TouchableOpacity>
            {type === CameraType.front ? (null) : (
              <TouchableOpacity onPress={handleFlashMode} style={styles.button}>
                <Text style={styles.white}>Flash {flash === FlashMode.on ? 'ON' : 'OFF'}</Text>
              </TouchableOpacity>
            )}
          </View>
        </Camera>
      </View>
      <View>
        <TouchableOpacity onPress={takePicture} style={styles.button}>
          <Text style={styles.white}>Tirar foto</Text>
        </TouchableOpacity>
      </View>
      {data ? <ModalPhoto isOpen={isOpen} data={data} setData={setData} /> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    marginTop: 10,
    padding: 20,
    backgroundColor: 'purple',
  },
  white: {
    color: 'white'
  },
  camera: {
    width: 250,
    height: 450,
  }
})