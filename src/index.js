import './style.scss';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isNil from 'lodash/isNil';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import find from 'lodash/find';
import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

class SuperTreeview extends Component {
  constructor(props) {
    super(props);

    const data = cloneDeep(this.props.data);

    this.state = {
      data: data[0].children,
      lastCheckToggledNodeIndex: null,
      nodePath: [data[0]],
      checkedObj: {},
      checkedIds: [],
    };

    this.handleUpdate = this.handleUpdate.bind(this);

    this.printNodes = this.printNodes.bind(this);
    this.printChildren = this.printChildren.bind(this);

    this.printCheckbox = this.printCheckbox.bind(this);
    this.printDeleteButton = this.printDeleteButton.bind(this);
    this.printExpandButton = this.printExpandButton.bind(this);
    this.printNoChildrenMessage = this.printNoChildrenMessage.bind(this);

    this.handleCheckToggle = this.handleCheckToggle.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleExpandToggle = this.handleExpandToggle.bind(this);

    this.nodeClick = this.nodeClick.bind(this);
    this.goRoot = this.goRoot.bind(this);
    this.goBack = this.goBack.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps.data, this.props.data)) {
      this.setState({ data: cloneDeep(nextProps.data) });
    }
  }

  handleUpdate(updatedData) {
    const { depth, onUpdateCb } = this.props;

    onUpdateCb(updatedData, depth);
  }

  handleCheckToggle(node, e) {
    const { keywordKey } = this.props;
    const tmpNode = cloneDeep(node);
    delete tmpNode['children'];

    console.log(tmpNode)

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
    console.log(checkedObj, checkedIds)
    this.setState({...this.state, checkedObj, checkedIds})

    // const { onCheckToggleCb, depth } = this.props;
    // const { lastCheckToggledNodeIndex } = this.state;
    // const data = cloneDeep(this.state.data);
    // const currentNode = find(data, node);
    // const currentNodeIndex = data.indexOf(currentNode);
    // const toggledNodes = [];
    // if (e.shiftKey && !isNil(lastCheckToggledNodeIndex)) {
    //   const rangeStart = Math.min(
    //     currentNodeIndex,
    //     lastCheckToggledNodeIndex
    //   );
    //   const rangeEnd = Math.max(
    //     currentNodeIndex,
    //     lastCheckToggledNodeIndex
    //   );

    //   const nodeRange = data.slice(rangeStart, rangeEnd + 1);

    //   nodeRange.forEach((node) => {
    //     node.isChecked = e.target.checked;
    //     toggledNodes.push(node);
    //   });
    // } else {
    //   currentNode.isChecked = e.target.checked;
    //   toggledNodes.push(currentNode);
    // }

    // onCheckToggleCb(toggledNodes, depth);
    // this.setState({ lastCheckToggledNodeIndex: currentNodeIndex });
    // this.handleUpdate(data);
  }

  handleDelete(node) {
    const { onDeleteCb, depth } = this.props;
    const data = cloneDeep(this.state.data);

    const newData = data.filter((nodeItem) => {
      return !isEqual(node, nodeItem);
    });

    onDeleteCb(node, newData, depth) && this.handleUpdate(newData);
  }

  handleExpandToggle(node) {
    const { onExpandToggleCb, depth } = this.props;
    const data = cloneDeep(this.state.data);
    const currentNode = find(data, node);

    currentNode.isExpanded = !currentNode.isExpanded;

    onExpandToggleCb(currentNode, depth);
    this.handleUpdate(data);
  }

  printCheckbox(node) {
    const { isCheckable, keywordLabel, depth } = this.props;

    if (isCheckable(node, depth)) {
      return (
        <input
          type="checkbox"
          name={node[keywordLabel]}
          onClick={(e) => {
            this.handleCheckToggle(node, e);
          }}
          checked={!!this.state.checkedObj[node.id]}
          id={node.id}
        />
      );
    }
  }

  printDeleteButton(node) {
    const { isDeletable, depth, deleteElement } = this.props;

    if (isDeletable(node, depth)) {
      return (
        <div className="delete-btn"
          onClick={() => {
            this.handleDelete(node);
          }}
        >
          {deleteElement}
        </div>
      );
    }
  }

  printExpandButton(node) {
    const className = node.isExpanded
      ? 'contact-triangle-btn-down'
      : 'contact-triangle-btn-right';
    const { isExpandable, depth } = this.props;

    if (isExpandable(node, depth)) {
      return (
        <div
          className={`contact-triangle-btn ${className}`}
          onClick={() => {
            this.handleExpandToggle(node);
          }}
        />
      );
    } else {
      return <div className={`contact-triangle-btn   contact-triangle-btn-none`} />
    }
  }

  printNoChildrenMessage() {
    const {
      transitionExitTimeout,
      noChildrenAvailableMessage
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
            {noChildrenAvailableMessage}
          </div>
        </div>
      </CSSTransition>
    );
  }

  printNodes(nodeArray) {
    const {
      keywordKey,
      keywordLabel,
      keywordDir,
      depth,
      transitionEnterTimeout,
      transitionExitTimeout,
      getStyleClassCb
    } = this.props;
    const { nodePath, checkedObj, checkedIds } = this.state;
    const {
      printExpandButton,
      printCheckbox,
      printDeleteButton,
      printChildren,
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

    const currNode = nodePath[nodePath.length - 1];

    return (
      <TransitionGroup>
        <CSSTransition {...nodeTransitionProps}>
          <div className="contact-header">
            <div className="root-name" onClick={goRoot}>{nodePath[0][keywordLabel]}</div>
            <div className="curr-name">
              <label className="contact-checkbox">
                <input
                  type="checkbox"
                  checked={currNode.children && !currNode.children.filter(item => !item.isDir).some(item => !checkedObj[item.id])}
                />
                {currNode[keywordLabel]}
                <span className="contact-checkbox-mark"></span>
              </label>
              <span className="back">{nodePath.length > 1 && <div onClick={goBack}>返回上一级</div>}</span>
            </div>
          </div>
        </CSSTransition>
        {isEmpty(nodeArray)
          ? this.printNoChildrenMessage()
          : nodeArray.map((node, index) => {
            const nodeText = get(node, keywordLabel, '');
            const isDir = get(node, keywordDir, false);

            return (
              <CSSTransition
                {...nodeTransitionProps}
                key={node[keywordKey] || index}
              >
                <div
                  className={
                    'contact-node' +
                    getStyleClassCb(node)
                  }
                  onClick={() => nodeClick(node)}
                >
                  <div className="contact-node-content">
                    <label className="contact-checkbox">
                      {!isDir && printCheckbox(node, depth)}
                      {node[keywordLabel]}
                      {!isDir && <span className="contact-checkbox-mark"></span>}
                    </label>
                  </div>
                </div>
              </CSSTransition>
            );
          })}
      </TransitionGroup>
    );
  }

  printChildren(node) {
    if (!node.isExpanded) {
      return null;
    }

    const { keywordChildren, keywordChildrenLoading, depth } = this.props;
    const isChildrenLoading = get(node, keywordChildrenLoading, false);
    let childrenElement;

    if (isChildrenLoading) {
      childrenElement = get(this.props, 'loadingElement');
    } else {
      childrenElement = (
        <SuperTreeview
          {...this.props}
          data={node[keywordChildren] || []}
          depth={depth + 1}
          onUpdateCb={onChildrenUpdateCb.bind(this)}
        />
      );
    }

    return (
      <div className="contact-children-container">
        {childrenElement}
      </div>
    );

    function onChildrenUpdateCb(updatedData) {
      const data = cloneDeep(this.state.data);
      const currentNode = find(data, node);

      currentNode[keywordChildren] = updatedData;
      this.handleUpdate(data);
    }
  }

  nodeClick(node) {
    const { keywordDir } = this.props;
    const isDir = get(node, keywordDir, false);
    if (!isDir) return;
    const nodePath = cloneDeep(this.state.nodePath);
    nodePath.push(node);
    const state = {...this.state, data: node.children, nodePath};
    this.setState(state);
  }

  goRoot() {
    const nodePath = cloneDeep(this.state.nodePath);
    this.setState({...this.state, data: nodePath[0].children, nodePath: nodePath.slice(0,1)});
  }

  goBack() {
    const nodePath = cloneDeep(this.state.nodePath);
    nodePath.pop();
    this.setState({...this.state, data: nodePath[nodePath.length - 1].children, nodePath});
  }

  render() {
    return (
      <div className="contact">
        {this.printNodes(this.state.data)}
      </div>
    );
  }
}

SuperTreeview.propTypes = {
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

  onCheckToggleCb: PropTypes.func,
  onDeleteCb: PropTypes.func,
  onExpandToggleCb: PropTypes.func,
  onUpdateCb: PropTypes.func,

  transitionEnterTimeout: PropTypes.number,
  transitionExitTimeout: PropTypes.number
};

SuperTreeview.defaultProps = {
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

  keywordChildren: 'children',
  keywordChildrenLoading: 'isChildrenLoading',
  keywordLabel: 'name',
  keywordKey: 'id',
  keywordDir: 'isDir',

  loadingElement: <div>loading...</div>,

  noChildrenAvailableMessage: 'No data found',

  onCheckToggleCb: (/* Array of nodes, depth */) => {},
  onDeleteCb: (/* node, updatedData, depth */) => { return true },
  onExpandToggleCb: (/* node, depth */) => {},
  onUpdateCb: (/* updatedData, depth */) => {},

  transitionEnterTimeout: 500,
  transitionExitTimeout: 500
};

export default SuperTreeview;
