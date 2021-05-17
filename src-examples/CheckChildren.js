import React, { Component } from 'react';
import ContactPicker from '../dist/main.js';
import '../dist/style.css';

export default class extends Component {
	constructor (){
		super();

		this.state = {
			data: [
				{
					id: 2,
					name: 'Check/uncheck all children',
          icon: '',
					isDir: true,
					children: [
						{
							id: 21,
							name: 'Child 1',
              icon: '',
							isDir: true,
							children: [
								{
									id: 5,
									name: "Grand Child 1",
                  icon: 'https://img-s-msn-com.akamaized.net/tenant/amp/entityid/BB12cKGd.img',
								},
								{
									id: 6,
									name: "Grand Child 2",
                  icon: 'https://img-s-msn-com.akamaized.net/tenant/amp/entityid/BB12cKGd.img',
								},
								{
									id: 7,
									name: "Grand Child 3",
                  icon: 'https://img-s-msn-com.akamaized.net/tenant/amp/entityid/BB12cKGd.img',
								},
								{
									id: 8,
									name: "Grand Child 4",
                  icon: 'https://img-s-msn-com.akamaized.net/tenant/amp/entityid/BB12cKGd.img',
								}
							]
						},
						{
							id: 22,
							name: 'Child 2',
              icon: 'https://img-s-msn-com.akamaized.net/tenant/amp/entityid/BB12cKGd.img',
						},
						{
							id: 23,
							name: 'Child 3',
              icon: 'https://img-s-msn-com.akamaized.net/tenant/amp/entityid/BB12cKGd.img',
						},
						{
							id: 24,
							name: 'Child 4',
              icon: '',
              isDir: true,
						}
					]
				}
			]
		}
	}

  keywordKey = 'id'
  keywordLabel = 'name'
  keywordDir = 'isDir'


  changeCb = (checkedIds, checkedObj) => {
    console.log(checkedIds, checkedObj);
  }

  itemRender = (item) => (<div>
    <img src={item.icon} style={{borderRadius: '50%', height: '20px', marginRight: '5px'}} />
    {item[this.keywordLabel]}
  </div>)

  selectedItemRender = (item) => (<div key={item[this.keywordKey]} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '30px'}}>
    <div>
      <img src={item.icon} style={{borderRadius: '50%', height: '20px', marginRight: '5px'}} />
      {item[this.keywordLabel]}
    </div>
    <span style={{cursor: 'pointer'}} onClick={() => this.treeComp.handleCheckToggle(item)}>X</span>
  </div>)

  searchRender = () => (
    <select value="" placeholder="" onChange={() => this.treeComp.handleCheckToggle({
      id: 5,
      name: "Grand Child 1",
      icon: 'https://img-s-msn-com.akamaized.net/tenant/amp/entityid/BB12cKGd.img',
    }, true)}>
      <option value="">--选择--</option>
      <option value="5">555555</option>
    </select>
  )

  onRef = (ref) => {
    this.treeComp = ref
  }

	render(){
		return (
			<div>
					<ContactPicker
            onRef={this.onRef}
            data={ this.state.data }
            defaultIds={[5]}
            defaultObj={{5: {
              id: 5,
              name: "Grand Child 1",
              icon: 'https://img-s-msn-com.akamaized.net/tenant/amp/entityid/BB12cKGd.img',
            }}}
            keywordKey={this.keywordKey}
            keywordLabel={this.keywordLabel}
            keywordDir={this.keywordDir}
            noChildrenAvailableMessage="没有数据"
            onChangeCb={this.changeCb}
            itemRender={this.itemRender}
            selectedItemRender={this.selectedItemRender}
            searchRender={this.searchRender}
					/>
			</div>
		)
	}
}
