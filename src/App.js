import React, { useCallback, useEffect, useState } from 'react';
import Todo from './Todo';
import AddTodo from "./AddTodo.js"
import { Paper, List, Container, Grid, Button, AppBar, Toolbar, Typography, } from "@material-ui/core"
import './App.css';
import { call, signout } from './service/ApiService';
import { useNavigate } from 'react-router-dom';

const App = () => {
  const [items, setItems] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !items) {
      navigate("/login"); 
    }

    call("/todo", "GET", null).then((response) => {
      setItems(response.data["data"]);
      setLoading(false);
    }).catch((error) => {
      // 추가된 부분
      console.log(error.status);
      setLoading(false);
    });
  }, [loading]);

  const add = useCallback((item) => {
    call("/todo", "POST", item).then((response) => {
      setItems(response.data["data"]);
    });
  });

  const _delete = useCallback((item) => {
    call("/todo", "DELETE", item).then((response) => {
      setItems(response.data["data"]);
    });
  });

  const update = useCallback((item) => {
    call("/todo", "PUT", item).then((response) => {
      setItems(response.data["data"]);
    });
  });

  var todoItems = items.length > 0 && (
    <Paper style={{ margin: 16 }}>
      <List>
        {items.map((item, idx) => (
          <Todo 
            item={item}
            key={item.id}
            delete={_delete}
            update={update}
          />
        ))}
      </List>
    </Paper>
  );

  const exit = useCallback(() => {
    signout();
    navigate("/login")
  });

  // navigationBar 추가
  var navigationBar = (
    <AppBar position="static">
      <Toolbar>
        <Grid justifyContent="space-between" container>
          <Grid item>
            <Typography variant="h6">오늘의 할 일</Typography>
          </Grid>
          <Grid>
            <Button color="inherit" onClick={exit}>
              로그아웃
            </Button>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );

  /* 로딩 중이 아닐 때 렌더링할 부분 */
  var todoListPage = (
    <div>
      {navigationBar} { /* 내비게이션 바 렌더링 */ }
      <Container maxWidth="md">
        <AddTodo add={add} />
        <div className="TodoList">{todoItems}</div>
      </Container>
    </div>
  );

  /* 로딩 중일 때 렌더링할 부분 */
  var loadingPage = (
    <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh'}}>
      <h1> 로딩중.. </h1>
    </div>
  );
  var content = loadingPage;
  if (!loading && items) {
    /* 로딩 중이 아니면 todoListPage를 선택 */
    content = todoListPage;
  }

  return (
    /* 선택한 content 렌더링 */
    <div>{content}</div>
  )
}

export default App;