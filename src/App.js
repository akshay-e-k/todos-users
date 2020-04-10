import React from 'react';
import './App.css';
import 'antd/dist/antd.css';
import { Tabs, Button, Table, Modal, Form, Input, DatePicker } from 'antd';

const { TabPane } = Tabs;

const TodoForm = (props) => {

  const [loading, setLoading] = React.useState(false);

  const [count, incrementCount] = React.useState(0);

  const [form] = Form.useForm();

  const onFinish = async (newTodo) => {
    form.resetFields();
    setLoading(true);
    async function wait(duration = 1000) {
      await new Promise(resolve => setTimeout(resolve, duration));
    }
    await wait(2000);
    setLoading(false);
    newTodo.id = "todo" + count;
    incrementCount(count + 1);
    if(localStorage.getItem("todos")) {
      const todos = JSON.parse(localStorage.getItem("todos"));
      todos.push(newTodo);
      localStorage.setItem("todos", JSON.stringify(todos));
      props.updateTodos();
    }
    else {
      const userArray = [newTodo];
      localStorage.setItem("todos", JSON.stringify(userArray));
      props.updateTodos();
    }
    console.log('Success:', newTodo);
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      name="basic"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      form={form}
    >
      <Form.Item
        label="Action"
        name="action"
        rules={[{ required: true, message: 'Please input your action!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Date"
        name="dateAdded"
        rules={[{ required: true, message: 'Please input your date!' }]}
      >
        <DatePicker showTime />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Save
        </Button>
      </Form.Item>
    </Form>
  );
};

const UserForm = (props) => {

  const [loading, setLoading] = React.useState(false);

  const [count, incrementCount] = React.useState(0);

  const [form] = Form.useForm();

  const onFinish = async (newUser) => {
    form.resetFields();
    setLoading(true);
    async function wait(duration = 1000) {
      await new Promise(resolve => setTimeout(resolve, duration));
    }
    await wait(2000);
    setLoading(false);
    newUser.id = "user" + count;
    incrementCount(count + 1);
    if(localStorage.getItem("users")) {
      const users = JSON.parse(localStorage.getItem("users"));
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      props.updateUsers();
    }
    else {
      const userArray = [newUser];
      localStorage.setItem("users", JSON.stringify(userArray));
      props.updateUsers();
    }
    console.log('Success:', newUser);
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      name="basic"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      form={form}
    >
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: 'Please input your name!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: 'Please input your email!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Save
        </Button>
      </Form.Item>
    </Form>
  );
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      usersData: "",
      todosData: "",
      usersColumns: [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Action',
          key: 'action',
          render: (text, record) => (
            <span>
              <a href="#" className="edit-link">Edit</a>
              <a href="#" className="delete-link" onClick={() => this.deleteItem(record.id)}>Delete</a>
            </span>
          ),
        }
      ],
      todosColumns: [
        {
          title: 'Todo Name',
          dataIndex: 'action',
          key: 'action',
        },
        {
          title: 'Action',
          key: 'action',
          render: (text, record) => (
            <span>
              <a href="#" className="edit-link">Edit</a>
              <a href="#" className="delete-link" onClick={() => this.deleteItem(record.id)}>Delete</a>
            </span>
          ),
        }
      ],
      visible: false,
      confirmLoading: false,
      showTodoForm: false,
      showUserForm: false
    }
  }

  componentDidMount() {
    const users = JSON.parse(localStorage.getItem("users"));
    this.setState({usersData: users});
    const todos = JSON.parse(localStorage.getItem("todos"));
    this.setState({todosData: todos});
  }

  deleteItem = (id) => {
    let items = [];
    let itemType = "";
    if(id.includes("todo")) {
      items = JSON.parse(localStorage.getItem("todos"));
      itemType = "todos";
    }
    else if(id.includes("user")) {
      items = JSON.parse(localStorage.getItem("users"));
      itemType = "users"
    }
    let newItems = items.filter(function(item) {
      return item.id !== id;
    });
    localStorage.setItem(itemType, JSON.stringify(newItems));
    if(itemType === "todos") {
      this.getTodos();
    }
    else {
      this.getUsers();
    }
  }

  getUsers = () => {
    const users = JSON.parse(localStorage.getItem("users"));
    this.setState({usersData: users, visible: false});
  }

  getTodos = () => {
    const todos = JSON.parse(localStorage.getItem("todos"));
    this.setState({todosData: todos, visible: false});
  }

  handleOk = (values) => {
    console.log(values);
    this.setState({
      confirmLoading: true,
    });
    setTimeout(() => {
      this.setState({
        visible: false,
        confirmLoading: false,
      });
    }, 2000);
  };

  handleCancel = () => {
    console.log('Clicked cancel button');
    this.setState({
      visible: false,
    });
  };

  showModal = (type) => {
    if(type === "showTodoForm") {
      this.setState({showTodoForm: true, showUserForm: false})
    }
    else {
      this.setState({showUserForm: true, showTodoForm: false});
    }
    this.setState({
      visible: true
    });
  };

  render() {
    const { visible, confirmLoading, showTodoForm, showUserForm } = this.state;
    return (
      <div className="App">
        <div>
          <Modal
            title="Your Inputs"
            visible={visible}
            // onOk={this.handleOk}
            confirmLoading={confirmLoading}
            onCancel={this.handleCancel}
            footer={""}
          >
            {showTodoForm &&
              <TodoForm updateTodos={this.getTodos} />
            }
            {showUserForm &&
              <UserForm updateUsers={this.getUsers} />
            }
          </Modal>
        </div>
        <Tabs>
          <TabPane tab="Todos" key="1">
              <div className="create-buttons-block">
                <Button onClick={() => this.showModal("showTodoForm")}>Create Todos</Button>
              </div>
              <Table dataSource={this.state.todosData} columns={this.state.todosColumns} />;
          </TabPane>
          <TabPane tab="Users" key="2">
              <div className="create-buttons-block">
                <Button onClick={() => this.showModal("showUserForm")}>Create Users</Button>
              </div>
              <Table dataSource={this.state.usersData} columns={this.state.usersColumns} />;
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default App;
