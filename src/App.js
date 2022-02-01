import React from 'react';
import Todo from './Todo';
import AddTodo from "./AddTodo.js"
import { Paper, List, Container, Grid, Button, AppBar, Toolbar, Typography, } from "@material-ui/core"
import './App.css';
import { call, signout } from './service/ApiService';

class App extends React.Component {
  constructor(props) {
    super(props);
    // (1) item -> items 배열로
    this.state = {
      items: [],
      // (1) 로딩 중이라는 상태를 표현할 변수 생성자에 상태 변수를 추가한다.
      loading: true,
    };
  }

  componentDidMount() {
    // const requestOptions = {
    //   method: "GET",
    //   headers: { "Content-Type": "application/json" },
    // };

    // fetch("http://localhost:8080/todo", requestOptions)
    //   .then((response) => response.json())
    //   .then(
    //     (response) => {
    //       this.setState({
    //         items: response.data,
    //       });
    //     },
    //     (error) => {
    //       this.setState({
    //         error,
    //       });
    //     }
    //   );

    // (2) componentDidMount에서 Todo 리스트를 가져오는
    // GET 요청이 성공적으로 리턴하는 경우 loading을 false로 고친다.
    // 더 이상 로딩 중이 아니라는 뜻이다.
    call("/todo", "GET", null).then((response) => {
        this.setState({ items: response.data, loading: false });
      }
    );
  }

  add = (item) => {
    // const thisItems = this.state.items;
    // item.id = "ID-" + thisItems.length; // key를 위한 id 추가
    // item.done = false; // done 초기화
    // thisItems.push(item); // 리스트에 아이템 추가
    // this.setState({ items: thisItems }); // 업데이트는 반드시 this.setState로 해야 됨
    // console.log("items : ", this.state.items);

    call("/todo", "POST", item).then((response) =>
      this.setState({ items: response.data })
    );
  }

  delete = (item) => {
    // const thisItems = this.state.items;
    // console.log("Before Update Items : ", this.state.items)
    // const newItems = thisItems.filter(e => e.id !== item.id);
    // this.setState({ items: newItems }, () => {
    //   // 디버깅 콜백
    //   console.log("Update Items : ", this.state.items)
    // });
    call("/todo", "DELETE", item).then((reponse) =>
      this.setState({ items: reponse.data })
    );
  }

  update = (item) => {
    call("/todo", "PUT", item).then((response) =>
      this.setState({ items: response.data })
    );
  }

  render() {
    var todoItems = this.state.items.length > 0 && (
      <Paper style={{ margin: 16 }}>
        <List>
          {this.state.items.map((item, idx) => (
            <Todo 
              item={item}
              key={item.id}
              delete={this.delete}
              update={this.update}
            />
          ))}
        </List>
      </Paper>
    );

    // navigationBar 추가
    var navigationBar = (
      <AppBar position="static">
        <Toolbar>
          <Grid justifyContent="space-between" container>
            <Grid item>
              <Typography variant="h6">오늘의 할 일</Typography>
            </Grid>
            <Grid>
              <Button color="inherit" onClick={signout}>
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
          <AddTodo add={this.add} />
          <div className="TodoList">{todoItems}</div>
        </Container>
      </div>
    );

    /* 로딩 중일 때 렌더링할 부분 */
    var loadingPage = <h1> 로딩중.. </h1>
    var content = loadingPage;
    if (!this.state.loading) {
      /* 로딩 중이 아니면 todoListPage를 선택 */
      content = todoListPage;
    }

    /* 선택한 content 렌더링 */
    return <div className="App">{content}</div>



    // return (
    //   <div className="App">
    //     {navigationBar} {/* 내비게이션 바 렌더링 */}
    //     <Container maxWidth="md">
    //       <AddTodo add={this.add} />
    //       <div className="TodoList">{todoItems}</div>
    //     </Container>
    //   </div>
    // )
  }
}

export default App;