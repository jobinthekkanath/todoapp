import React,{useState,useEffect} from 'react'
import List from '../List/List'
import Alert from '../Alert/Alert';

const getLocalStorage=()=>{
  let list=localStorage.getItem('list');
  if (list){
    return (list =JSON.parse(localStorage.getItem('list')));
  }else{
    return[];
  }
};

function Home() {

  const [task, setTask] = useState('');
  const [list, setList] = useState(getLocalStorage());
  const[isEditing, setIsEditing]=useState(false);
  const[editID,setEditID]=useState(null);
  const[alert,setAlert]=useState({show:false, msg:'',type:''});

  const handleSubmit=(e)=>{
    e.preventDefault();
    if (!task) {
      showAlert(true,'danger','please enter value');
    } else if (task && isEditing){
      setList(
        list.map((item)=>{
          if (item.id === editID){
            return{...item, title:task};
          }
          return item;
        })
      );
      setTask('');
      setEditID(null);
      setIsEditing(false);
      showAlert(true,'success','value changed');
    }else{
      showAlert(true,'success','item added to the list');
      const newItem={id:new Date().getTime().toString(),title:task};
      setList([...list,newItem]);
      setTask('');
    }
  };

  const showAlert=(show = false, type='',msg='')=>{
    setAlert({show,type,msg});
  }

  const clearList=()=>{
    showAlert(true,'danger','empty list');
    setList([]);
  };

  const removeItem=(id)=>{
    showAlert(true,'danger','item removed');
    setList(list.filter((item)=>item.id !==id));
  };

  const editItem=(id)=>{
    const specificItem=list.find((item)=>item.id===id);
    setIsEditing(true);
    setEditID(id);
    setTask(specificItem.title);
  };

  useEffect(()=>{
    localStorage.setItem('list',JSON.stringify(list));
  },[list]);

  return (
    <section className='section-center'>
        <form className='todo-form' onSubmit={handleSubmit}>
          {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} /> }
            <h3>Todo App</h3>
            <div className="form-control">
                <input type='text' className='todo' placeholder='Enter a task' value={task} onChange={(e)=>setTask(e.target.value)} />
                <button className='submit-btn' type='submit' >{isEditing ? 'edit':'submit' }</button>
            </div>
        </form>
        {
          list.length >0 && (
        <div className="todo-container">
          <List items={list} removeItem={removeItem} editItem={editItem} />
          <button className='clear-btn ' onClick={clearList} >Clear Items</button>
        </div>
          )
        }
        
        
    </section>
  )
}

export default Home
