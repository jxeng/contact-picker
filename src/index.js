import './style.scss';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { find } from 'lodash';
class ContactPicker extends Component {
  constructor(props) {
    super(props);

    const data = cloneDeep(this.props.data);
    const defaultIds = cloneDeep(this.props.defaultIds);
    const defaultObj = cloneDeep(this.props.defaultObj);

    this.state = {
      data: data.length > 0 ? data[0].children : [],
      lastCheckToggledNodeIndex: null,
      nodePath: data.length > 0 ? [data[0]] : [],
      checkedObj: defaultObj,
      checkedIds: defaultIds,
      loading: false,
    };

    this.printNodes = this.printNodes.bind(this);

    this.printCheckbox = this.printCheckbox.bind(this);
    this.printNoChildrenMessage = this.printNoChildrenMessage.bind(this);

    this.handleCheckToggle = this.handleCheckToggle.bind(this);
    this.handleCheckAllToggle = this.handleCheckAllToggle.bind(this);

    this.nodeClick = this.nodeClick.bind(this);
    this.goRoot = this.goRoot.bind(this);
    this.goBack = this.goBack.bind(this);
    this.clearAll = this.clearAll.bind(this);
  }

  componentDidMount(){
    this.props.onRef(this)
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps.data, this.props.data)
      || !isEqual(nextProps.defaultIds, this.props.defaultIds)
      || !isEqual(nextProps.defaultObj, this.props.defaultObj)
    ) {
      const data = cloneDeep(nextProps.data);
      this.setState({
        ...this.state,
        data: this.state.data.length > 0 ? this.state.data :(data.length > 0 ? data[0].children : []),
        nodePath: this.state.nodePath.length > 0 ? this.state.nodePath : (data.length > 0 ? [data[0]] : []),
        defaultIds: cloneDeep(nextProps.defaultIds),
        checkedIds: cloneDeep(nextProps.defaultIds),
        defaultObj: cloneDeep(nextProps.defaultObj),
        checkedObj: cloneDeep(nextProps.defaultObj),
      });
    }
  }

  handleCheckToggle(node, addMode = false) {
    const { keywordKey, onChangeCb } = this.props;
    if (addMode && this.state.checkedObj[node[keywordKey]]) return;
    const tmpNode = {...node};
    if (tmpNode[keywordKey] === undefined) return;
    delete tmpNode['children'];

    let checkedObj = {...this.state.checkedObj};
    let checkedIds = [];


    if (!this.state.checkedObj[tmpNode[keywordKey]]) {
      checkedObj[tmpNode[keywordKey]] = tmpNode;
    } else {
      delete checkedObj[tmpNode[keywordKey]];
    }

    if (!this.state.checkedIds.includes(tmpNode[keywordKey])) {
      checkedIds = [...this.state.checkedIds, tmpNode[keywordKey]];
    } else {
      for (const id of this.state.checkedIds) {
        if (id === tmpNode[keywordKey]) continue;
        checkedIds.push(id);
      }
    }

    this.setState({...this.state, checkedObj, checkedIds}, () => {
      onChangeCb(checkedIds, checkedObj);
    });
  }

  handleCheckAllToggle(nodes, isChecked) {
    if (!nodes || nodes.length === 0) return;

    const { keywordKey, keywordDir, onChangeCb } = this.props;

    let checkedObj = {...this.state.checkedObj};
    let checkedIds = [...this.state.checkedIds];

    let ids = nodes.filter(item => !item[keywordDir]).map(item => item[keywordKey]);

    checkedIds = checkedIds.filter(id => !ids.includes(id));

    if (!isChecked) checkedIds = [...checkedIds, ...ids];

    for (const node of nodes) {
      if (node[keywordDir]) continue;
      const tmpNode = {...node};
      delete tmpNode['children'];

      if (!checkedObj[tmpNode[keywordKey]] && !isChecked) {
        checkedObj[tmpNode[keywordKey]] = tmpNode;
      } else if (checkedObj[tmpNode[keywordKey]] && isChecked) {
        delete checkedObj[tmpNode[keywordKey]];
      }
    }

    this.setState({...this.state, checkedObj, checkedIds}, () => {
      onChangeCb(checkedIds, checkedObj);
    });
  }

  printCheckbox(node) {
    const { keywordKey, keywordLabel } = this.props;

    return (
      <input
        type="checkbox"
        name={node[keywordLabel]}
        onClick={() => {
          this.handleCheckToggle(node, false);
        }}
        checked={!!this.state.checkedObj[node[keywordKey]]}
        id={node[keywordKey]}
        onChange={() => {}}
      />
    );
  }

  printMessage(element) {
    const {
      transitionExitTimeout,
    } = this.props;
    const noChildrenTransitionProps = {
      classNames: 'contact-no-children-transition',
      key: 'contact-no-children',
      style: {
        transitionDuration: `${transitionExitTimeout}ms`,
        transitionDelay: `${transitionExitTimeout}ms`
      },
      timeout: {
        enter: transitionExitTimeout
      },
      exit: false
    };

    return (
      <CSSTransition {...noChildrenTransitionProps}>
        <div className="contact-no-children">
          <div className="contact-no-children-content">
            {element}
          </div>
        </div>
      </CSSTransition>
    );
  }

  printNoChildrenMessage() {
    const {
      noChildrenAvailableMessage
    } = this.props;
    this.printMessage(noChildrenAvailableMessage)
  }

  printLoadingMessage() {
    const {
      loadingMessage
    } = this.props;
    this.printMessage(loadingMessage)
  }

  nodeClick(node) {
    const { keywordDir, onUpdateCb } = this.props;
    const isDir = get(node, keywordDir, false);
    if (!isDir) return;
    const currNode = cloneDeep(node);
    this.setState({...this.state, loading: true});
    onUpdateCb(node).then(updateData => {
      if (updateData.length > 0) currNode.children = updateData;
      const nodePath = cloneDeep(this.state.nodePath);
      nodePath.push(currNode);
      this.setState({...this.state, data: currNode.children, nodePath, loading: false});
    })
  }

  goRoot() {
    if (this.state.nodePath.length === 0) return;
    const nodePath = cloneDeep(this.state.nodePath);
    this.setState({...this.state, data: nodePath[0].children, nodePath: nodePath.slice(0,1)});
  }

  goBack() {
    const nodePath = cloneDeep(this.state.nodePath);
    nodePath.pop();
    this.setState({...this.state, data: nodePath[nodePath.length - 1].children, nodePath});
  }

  clearAll() {
    this.setState({...this.state, checkedIds: [], checkedObj: {}});
  }

  printNodes(nodeArray) {
    if (this.state.nodePath.length === 0) return <div className="contact-list"></div>;
    const nodes = cloneDeep(nodeArray);

    const {
      keywordKey,
      keywordLabel,
      keywordDir,
      depth,
      transitionEnterTimeout,
      transitionExitTimeout,
      getStyleClassCb,
      itemRender,
    } = this.props;
    const { nodePath, checkedObj } = this.state;
    const {
      printCheckbox,
      nodeClick,
      goRoot,
      goBack,
    } = this;

    const nodeTransitionProps = {
      classNames: 'contact-node-transition',
      style: {
        transitionDuration: `${transitionEnterTimeout}ms`
      },
      timeout: {
        enter: transitionEnterTimeout,
        exit: transitionExitTimeout
      }
    };

    const compareFunc = (prev, curr) => {
      if (prev[keywordDir] && !curr[keywordDir]) return -1;
      if (!prev[keywordDir] && curr[keywordDir] ) return 1;
      return 0;
    };

    Array.isArray(nodes) && nodes.sort(compareFunc);

    const currNode = nodePath[nodePath.length - 1];

    const checkableChildren = currNode.children && currNode.children.filter(item => !item.isDir) || [];

    const allChecked = checkableChildren.length > 0 && !checkableChildren.some(item => !checkedObj[item[keywordKey]]);



    return (
      <div className="contact-list">
        <TransitionGroup>
          <CSSTransition {...nodeTransitionProps}>
            <div className="contact-header">
              <div className="root-name" onClick={goRoot}>{nodePath[0][keywordLabel]}</div>
              <div className="curr-name">
                <label className="contact-checkbox">
                  <input
                    type="checkbox"
                    onClick={() => {
                      this.handleCheckAllToggle(currNode.children, allChecked);
                    }}
                    checked={allChecked}
                    onChange={() => {}}
                  />
                  {currNode[keywordLabel]}({checkableChildren.length})
                  <span className="contact-checkbox-mark"></span>
                </label>
                <span className="back">{nodePath.length > 1 && <div onClick={goBack}>返回上一级</div>}</span>
              </div>
            </div>
          </CSSTransition>
        </TransitionGroup>
        <div className="item-container">
        {isEmpty(nodeArray)
          ? this.printNoChildrenMessage()
          : this.state.loading ? '正在加载'
          : nodes.map((node, index) => {
            const isDir = get(node, keywordDir, false);

            return (
              <div
                className={
                  'contact-node' +
                  getStyleClassCb(node)
                }
                key={node[keywordKey] || index}
                onClick={() => nodeClick(node)}
              >
                <div className="contact-node-content">
                  <label className="contact-checkbox">
                    {!isDir && printCheckbox(node, depth)}
                    {itemRender(node)}
                    {!isDir && <span className="contact-checkbox-mark"></span>}
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  printMembers() {
    const { checkedIds, checkedObj } = this.state;
    const { selectedItemRender, searchRender } = this.props;
    return (<div className="contact-members">
        <div className="members-search">{searchRender()}</div>
        <p className="members-header">
          <span>已选成员：{checkedIds.length}</span>
          <span className="clear" onClick={this.clearAll}>清空</span>
        </p>
        <div className="item-container">
          {checkedIds.map(id =>selectedItemRender(checkedObj[id]))}
        </div>
      </div>)
  }

  render() {
    return (
      <div className="contact">
        {this.printNodes(this.state.data)}
        {this.printMembers()}
      </div>
    );
  }
}

ContactPicker.propTypes = {
  data: PropTypes.array.isRequired,
  depth: PropTypes.number,

  deleteElement: PropTypes.element,

  getStyleClassCb: PropTypes.func,

  isCheckable: PropTypes.func,
  isDeletable: PropTypes.func,
  isExpandable: PropTypes.func,

  keywordChildren: PropTypes.string,
  keywordChildrenLoading: PropTypes.string,
  keywordKey: PropTypes.string,
  keywordLabel: PropTypes.string,
  keywordDir: PropTypes.string,

  loadingElement: PropTypes.element,
  noChildrenAvailableMessage: PropTypes.string,

  onUpdateCb: PropTypes.func,
  onChangeCb: PropTypes.func,
  itemRender: PropTypes.func,
  selectedItemRender: PropTypes.func,

  transitionEnterTimeout: PropTypes.number,
  transitionExitTimeout: PropTypes.number,

};

ContactPicker.defaultProps = {
  depth: 0,

  deleteElement: <div>(X)</div>,

  getStyleClassCb: (/* node, depth */) => {
    return '';
  },
  isCheckable: (/* node, depth */) => {
    return true;
  },
  isDeletable: (/* node, depth */) => {
    return false;
  },
  isExpandable: (/* node, depth */) => {
    return false;
  },

  defaultIds: () => {
    return [];
  },

  defaultObj: () => {
    return {}
  },

  keywordChildren: 'children',
  keywordChildrenLoading: 'isChildrenLoading',
  keywordLabel: 'name',
  keywordKey: 'id',
  keywordDir: 'isDir',

  loadingMessage: '正在加载',
  noChildrenAvailableMessage: '没有数据',

  onUpdateCb: (item) => { return Promise.resolve([])},
  onChangeCb: (/* checkedIds, checkedObj */) => {},
  searchRender: () => {},
  itemRender: (item) => item[this.keywordLabel],
  selectedItemRender: (item) => item[this.keywordLabel],

  transitionEnterTimeout: 500,
  transitionExitTimeout: 500
};

export default ContactPicker;
