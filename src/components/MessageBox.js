import React from 'react';
import $ from 'jquery';
import IScroll from 'iscroll';

function Message({message}) {
  return (
    <li className="message">
      <div className="name">{message.from.name}:</div>
      <div className="time">{new Date(message.meta.createAt).toLocaleString()}</div>
      <div className="content">{message.content}</div>
    </li>
  )
}

class MessageBox extends React.Component {
  constructor(props) {
    super(props);
    this.canMove=0;
  }

  componentDidMount() {
    console.log('componentDidMount');
    let me = this;
    $.ajax({
      type: 'GET'
      , url: '/getmessage'
      , success: (messages) => {
        me.props.getAll(messages);
      }
      , error: () => {
        console.log('连接失败，请稍后再试')
      }
    })
  }

  componentDidUpdate() {
    console.log('componentDidUpdate');


    let innerH=this.messages.scrollHeight;
    let outerH=this.messagesBox.clientHeight;
    let padding=parseInt(getComputedStyle(this.messagesBox)['paddingBottom']);
    console.log(innerH,outerH,padding);
    let canMove=innerH+padding-outerH;
    if(!this.myScroll){
      this.canMove=canMove;
      this.myScroll = new IScroll('.messagesBox', {
        mouseWheel: true
        ,scrollbars: true
        ,interactiveScrollbars:true
       , startY:-this.canMove
        ,resizeScrollbars:true
      });
    }else{
      if(canMove!==this.canMove){
        this.canMove=canMove;
        this.myScroll.refresh();
        this.myScroll.scrollTo(0,-this.canMove,500,IScroll.utils.ease.ease);
      }
    }
  }

  render() {
    let messages = this.props.messages;

    let messagesBox = messages.map((message, index) => (
      <Message key={index} message={message}/>
    ));

    return (
      <div
        className="messagesBox"
        ref={(box) => {
          this.messagesBox = box
        }}
      >
        <ul
          style={this.state}
          ref={(ul) => {
            this.messages = ul
          }}
        >
          {messagesBox}
        </ul>
      </div>
    )
  }
}

export default MessageBox
