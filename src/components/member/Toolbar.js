/*
   Toolbar
*/
import React, { Component } from 'react';
import { observer } from 'mobx-react';

@observer
export default class Toolbar extends Component {
   constructor(props) {
      super(props);
      this.state = {
         tel: '',
         name: ''
      };
   }

   submitMember = () => {
      const { tel, name } = this.state;

      if (!tel || !name) {
         return;
      }

      this.props.postMember({ name, tel });
   };

   onSearchChange = e => {
      const value = e.target.value;
      this.props.changeFilter(value);
   };

   changeOutput(key, e) {
      this.setState({ [key]: e.target.value });
   }

   render() {
      const { tel, name } = this.state;
      const { filter } = this.props;
      return (
         <div className="toolbar-container">
            <p className="add-tool">
               tel: <input type="text" value={tel} onChange={this.changeOutput.bind(this, 'tel')} />
               name: <input type="text" value={name} onChange={this.changeOutput.bind(this, 'name')} />
               <button onClick={this.submitMember}>提交</button>
            </p>
            <p className="search-tool">
               search: <input type="text" value={filter} onChange={this.onSearchChange} />
            </p>
         </div>
      );
   }
}
