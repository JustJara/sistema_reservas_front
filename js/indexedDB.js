let db
const request = window.indexedDB.open('reservas', 1)

request.onerror= (e) =>{
    console.error('Error al abrir la base de datos:', e.target.error)
};

request.onupgradeneeded =(e)=> {
    db = e.target.result;
    const objectStore= db.createObjectStore('datos',{
        keyPath:'id',
        autoIncrement: true
    })
    console.log('base de datos creada y actualizada')
}

request.onsuccess=(e)=>{
    db = e.target.result
    console.log('Conexion establecida con la base de datos')
}

export const guardarDatos =(datos)=>{
    const transaction = db.transaction('datos', 'readwrite');
    const objectStore = transaction.objectStore('datos')
    const request = objectStore.add(datos)

    request.onerror=(e)=>{
        console.error('error al guardar datos:', e.target.error)
    }

    request.onsuccess =(e)=>{
        console.log('Datos guardados con exito')
    }
    }

export const obtenerTodos= async ()=>{
    const transaction = await db.transaction('datos', 'readonly');
    const objectStore = transaction.objectStore('datos')
    const request = objectStore.getAll()

    request.onerror=(e)=>{
        console.error('error al guardar datos:', e.target.error)
    }

    request.onsuccess =(e)=>{
        console.log('Datos guardados con exito')
        return e.target.result
    }
}