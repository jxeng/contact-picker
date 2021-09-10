import React, { Component } from 'react';
import ContactPicker from '../dist/main.js';
import '../dist/style.css';

export default class extends Component {
	constructor (){
		super();

		this.state = {
			data: []
		}
	}

  keywordKey = 'sId'
  keywordLabel = 'sName'
  keywordDir = 'isDir'

	componentDidMount() {
		setTimeout(() => {
		this.setState({
			data: [
				{
						"sId": "1",
						"sName": "武汉守明科技有限公司",
						"isDir": true,
						"sParentId": "",
						"children": [
								{
										"sId": "2",
										"sName": "后台",
										"isDir": true,
										"sParentId": "1",
										"children": [
											{ "sId": "FengZhongJinCao", "sName": "王强😀", "vDepId": [ "2" ] }
										]
								},
								{
										"sId": "3",
										"sName": "产品",
										"isDir": true,
										"sParentId": "1"
								},
								{
										"sId": "4",
										"sName": "测试",
										"isDir": true,
										"sParentId": "1"
								},
								{
										"sId": "6",
										"sName": "前端按时啊",
										"isDir": true,
										"sParentId": "1",
										"children": [
												{
														"sId": "7",
														"sName": "二位",
														"isDir": true,
														"sParentId": "6"
												}
										]
								},
								{
										"sId": "22Ban",
										"sName": "阮星星",
										"isDir": false
								},
								{
										"sId": "BaJiuZhiShi",
										"sName": "八九之十💙",
										"isDir": false
								},
								{
										"sId": "cd",
										"sName": "肖李宗",
										"isDir": false
								},
								{
										"sId": "DaLong",
										"sName": "一个夏天",
										"isDir": false
								},
								{
										"sId": "DanDan",
										"sName": "旦旦",
										"isDir": false
								},
								{
										"sId": "FangSong",
										"sName": "老房",
										"isDir": false
								},
								{
										"sId": "FeiSheHuiXingDongWu",
										"sName": "姚晟",
										"isDir": false
								},
								{
										"sId": "GengGeng",
										"sName": "耿奥",
										"isDir": false
								},
								{
										"sId": "heyz",
										"sName": "何英泽",
										"isDir": false
								},
								{
										"sId": "jxeng",
										"sName": "江雪锋",
										"isDir": false
								},
								{
										"sId": "LiangWenliangwen",
										"sName": "liangwen 良文",
										"isDir": false
								},
								{
										"sId": "LiPengKun",
										"sName": "李老师",
										"isDir": false
								},
								{
										"sId": "lynetteZhiZhi",
										"sName": "Lynette之之",
										"isDir": false
								},
								{
										"sId": "po",
										"sName": "周腾达",
										"isDir": false
								},
								{
										"sId": "sunny",
										"sName": "董美美",
										"isDir": false
								},
								{
										"sId": "XiaoHei",
										"sName": "石洋",
										"isDir": false
								},
								{
										"sId": "XiaoQi",
										"sName": "汪家晗",
										"isDir": false
								},
								{
										"sId": "XingHua",
										"sName": "程兴华",
										"isDir": false
								},
								{
										"sId": "XueJiaQi",
										"sName": "薛嘉琪",
										"isDir": false
								},
								{
										"sId": "YingZhiSen",
										"sName": "吴廷宇",
										"isDir": false
								},
								{
										"sId": "YunDago",
										"sName": "云鹏",
										"isDir": false
								},
								{
										"sId": "ZhiZhi",
										"sName": "邓靖之",
										"isDir": false
								}
						]
				}
		]
		})
	}, 1000)
	}

	updateCb = (item) => {
		console.log(item)
		if (!item.isDir) return;
		return new Promise(resolve => setTimeout(resolve, 1000)).then(() => ([
				// {
				// 	"sId": "1117",
				// 	"sName": "22二位",
				// 	"isDir": false,
				// 	"sParentId": "2"
				// },
				// {
				// 	"sId": "1118",
				// 	"sName": "11二位",
				// 	"isDir": false,
				// 	"sParentId": "2"
				// }
			]))
	}

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
              sId: 5,
              sName: "Grand Child 1",
              icon: 'https://img-s-msn-com.akamaized.net/tenant/amp/entityid/BB12cKGd.img',
            }}}
            keywordKey={this.keywordKey}
            keywordLabel={this.keywordLabel}
            keywordDir={this.keywordDir}
            loadingMessage={<span style={{color: 'red'}}>加载中</span>}
            noChildrenAvailableMessage={<span style={{color: 'red'}}>没有数据</span>}
            onChangeCb={this.changeCb}
            onUpdateCb={this.updateCb}
            itemRender={this.itemRender}
            selectedItemRender={this.selectedItemRender}
            searchRender={this.searchRender}
					/>
			</div>
		)
	}
}
