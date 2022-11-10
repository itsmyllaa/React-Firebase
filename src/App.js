import { useState, useEffect } from 'react';
//Abaixo estamos importando a conexão com o banco ref:"db"
import { db, auth } from './firebaseConnection';

import { 
  doc, 
  setDoc, 
  collection, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  onSnapshot
} from 'firebase/firestore'

import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'

import './App.css';

function App() {

  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [idPost, setiIdPost] = useState('');

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const [user, setUser] = useState(false);
  const [userDetail, setUserDetail] = useState({})

  const [posts, setPosts] = useState([]);
  
  useEffect(() => {

    async function loadPosts(){
      const unsub = onSnapshot(collection(db, 'Posts'), (snapshot) => {
        let listaPost = [];

        snapshot.forEach((doc) => {
           listaPost.push({
            id:doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
           })
        })
    
        setPosts(listaPost);
      })
    }

    loadPosts();

  }, [])

  useEffect(() => {

    async function checkLogin(){
      onAuthStateChanged(auth, (user) => {
        if(user){
          //Se tem usuário logado, ele entra aqui!
          console.log(user);
          setUser(true);
          setUserDetail({
            uid: user.uid,
            email: user.email
          })
          
        }else{
          //Se não possuir usuário logado ele entra aqui!
          setUser(false);
          setUserDetail({})
        }
      })
    }

    checkLogin();

  }, [])

  async function handleAdd(){
    
  //  await setDoc(doc(db, "Posts", "12345"), {
  //    titulo: titulo,
  //    autor: autor,
  //  })
  //  .then((error) => {
  //    console.log('Dados registrados no banco!')
  //  })
  //  .catch((error) => {
  //  console.log('Gerou erro' + error)
  // })

  await addDoc(collection(db, "Posts"), {
    titulo: titulo,
    autor: autor,
  })

  .then(() => {
    console.log("Cadastrado com sucesso!")
    setAutor('');
    setTitulo('');
  })

  .catch((error) => {
    console.log("ERROR" + error)
  })
  }

  async function buscarPost(){
   // const postRef = doc(db, "Posts", "12345")
   // await getDoc(postRef)
   // .then((snapshot) => {
   //   setAutor(snapshot.data().autor)
   //   setTitulo(snapshot.data().titulo)
   // })
   // .catch(() => {
   //   console.log("ERROR AO BUSCAR!")
   // })

   const postsRef = collection(db, "Posts")

   await getDocs(postsRef)

   .then((snapshot) => {

    let lista = [];

    snapshot.forEach((doc) => {
       lista.push({
        id:doc.id,
        titulo: doc.data().titulo,
        autor: doc.data().autor,
       })
    })

    setPosts(lista);

   })
   .catch((snapshot) => {
    console.log("Deu algum erro ao buscar!")
   })
  }

  async function editarPost(){
    const docRef = doc(db, 'Posts', idPost)

    await updateDoc(docRef, {
      titulo: titulo,
      autor: autor
    })
    .then(() => {
      console.log('Post atualizado!')
     
      setiIdPost('')
      setTitulo('')
      setAutor('')
    })
    .catch((error) => {
      console.log(error)
    })
  }

  async function excluirPost(id){
    const docRef = doc(db, "Posts", id)
    await deleteDoc(docRef)
    .then(() => {
      alert('POST DELETADO COM SUCESSO!')
    })
    .catch(() => {
      alert('NÃO FOI POSSIVEL DELETAR O POST!')
    })
  }

  async function novoUsuario(){
    await createUserWithEmailAndPassword(auth, email, senha)
    .then((value) => {
      alert('CADASTRADO COM SUCESSO!')
      console.log(value)
      setEmail('')
      setSenha('')
    })
    .catch((error) => {
      if(error.code === 'auth/weak-password'){
        alert('Senha muito fraca.')
      }else if(error.code === 'auth/email-already-in-use'){
        alert('E-mail já existe!')
      }
    })
  }

  async function logarUsuario(){
    await signInWithEmailAndPassword(auth, email, senha)
    .then((value) => {
      console.log('USUÁRIO LOGADO COM SUCESSO')
      console.log(value.user);

      setUserDetail({
        uid: value.user.uid,
        email: value.user.email,
      })

      setUser(true);

      setEmail('')
      setSenha('')
    })
    .catch(() => {
      console.log('ERRO AO FAZER LOGIN')
    })
  }

  async function fazerLogout(){

    await signOut(auth)
    setUser(false);
    setUserDetail({})

  }

  return (
    <div>
      <h1>React JS + Firebase :)</h1>

      { user && (
        <div>
          <strong>Seja bem vindo(a), você está logado :)</strong> <br/> <br/>
          <span>ID: {userDetail.uid} E-mail: {userDetail.email}</span> <br/>
          <button onClick={fazerLogout}>Sair da conta</button> 
          <br/> <br/>
        </div>
      )

      }

      <div className='container'>

        <h2>Usuários</h2>

        <label>E-mail</label>
          <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Digite um e-mail'
          />

        <label>Senha</label>
          <input
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder='Digite a senha'
          /> <br/>

          <button onClick={novoUsuario}>Cadastrar</button> <br/>

          <button onClick={logarUsuario}>Fazer login</button> <br/>

      </div>

          <br/> <br/>
          <hr/>
      
      <div className='container'>
        <h2>POSTS</h2>

        <label>ID do Post:</label>
        <input
        placeholder='Digite o ID do post'
        value={idPost}
        onChange={ (e) => setiIdPost(e.target.value) }
        />

        <label>Titulo:</label>
        <textarea
        type='text'
        placeholder='Digite o titulo'
        value={titulo}
        onChange={ (e) => setTitulo(e.target.value)}
        />

        <label>Autor:</label>
        <textarea
        type='text'
        placeholder='Autor do post'
        value={autor}
        onChange={ (e) => setAutor(e.target.value)}
        /> <br/>
        

        <button onClick={handleAdd}>Cadastrar</button> <br/>

        <button onClick={buscarPost}>Buscar post</button> <br/>

        <button onClick={editarPost}> Atualizar post</button>

        <ul>
          {posts.map((post) => {
            return(
              <li key={post.id}>
                <strong>ID: {post.id}</strong> <br/>
                <span>Titulo: {post.titulo}</span> <br/>
                <span>Autor: {post.autor}</span> <br/>
                <button onClick={() => excluirPost(post.id)}>Excluir</button> <br/> <br/>
              </li>
            )
          })}
        </ul>

      </div>
    </div>
  );
  }
export default App;