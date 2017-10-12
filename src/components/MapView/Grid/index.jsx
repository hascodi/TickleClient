import React, { Component } from 'react';
import * as d3 from 'd3';

import scrollIntoView from 'scroll-into-view';
import ReactDOM from 'react-dom';

// import scrollToComponent from 'react-scroll-to-component';
import VisibilitySensor from 'react-visibility-sensor';
import PropTypes from 'prop-types';

import cx from './index.scss';

// function getCol(n) {
//   // return  (3 + (-1) ** n - 2 * n)/ 4 * 3;
//   return -3 * (3 + (-1) ** n - 2 * n) / 4;
// }

function getCol(i, n, span) {
  // const a = d3.range(0, n, span);
  // return d3.range(0, n).map(d => a[Math.floor(d / 2)]);
  // return [1, 1, 4, 4, 7, 7, 10, 10, 13, 13, 16, 16, 19, 19, 22, 22];
  const cols = d3.range(1, n * span, span);
  return cols[Math.floor(i / 2)]; // Math.floor(i / 2) + 1;
}

class Grid extends Component {
  static propTypes = {
    children: PropTypes.node,
    height: PropTypes.number,
    clickHandler: PropTypes.function,
    span: PropTypes.number,
    activeSpan: PropTypes.number,
    columnWidth: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.cardClickHandler = this.cardClickHandler.bind(this);
    this.state = { selected: null };
  }

  componentDidMount() {
    // $(ReactDOM.findDOMNode(this)).carousel({ ride: 'pause', interval: false });
    //
    // scrollToComponent(this.Violet);
  }

  componentDidUpdate() {
    // console.log('item', this.item);
    // scrollToComponent(this.Violet);
  }

  // shouldComponentUpdate(nextProps) {
  //   const { height, children } = this.props;
  //   if (
  //     height !== nextProps.height ||
  //     children.length !== nextProps.children.length
  //   )
  //     return true;
  //   return false;
  // }
  scrollTo = name => {
    this._scroller.scrollTo(name);
  };

  cardClickHandler(d) {
    this.props.clickHandler(d);
  }

  render() {
    const { children, activeSpan, span, columnWidth } = this.props;
    // return (
    //   <div className={cx.wrapper}>
    //     {React.Children.map(children, (comp, i) => comp)}
    //   </div>
    // );
    //
    //
    return (
      <ScrollView ref={scroller => (this._scroller = scroller)}>
        <div
          className={cx.wrapper}
          style={{
            gridTemplateColumns: `repeat(${children.length *
              activeSpan}, ${columnWidth}px)`
          }}
        >
          {React.Children.map(children, (comp, i) => {
            const col = getCol(i, children.length, span); // Math.floor(i / 2) + 1;
            return (
              <VisibilitySensor
                offset={{
                  bottom: 0,
                  top: 0
                }}
              >
                {({ isVisible }) =>
                  <ScrollElement name={i}>
                    <Item
                      {...this.props}
                      {...comp.props}
                      defaultCol={col}
                      visible={isVisible}
                      index={i}
                      scrollTo={() => this.scrollTo(i)}
                    >
                      {comp}
                    </Item>
                  </ScrollElement>}
              </VisibilitySensor>
            );
          })}
        </div>
      </ScrollView>
    );
  }
}

Grid.defaultProps = {
  data: [],
  id: 'carouselExampleIndicators',
  height: 100,
  children: () => <div>test</div>,
  clickHandler: PropTypes.function,
  span: 3,
  activeSpan: 4,
  columnWidth: 35
};

class Item extends Component {
  static propTypes = {
    children: PropTypes.node,
    selected: PropTypes.bool,
    defaultCol: PropTypes.number,
    span: PropTypes.number,
    activeSpan: PropTypes.number,
    opacity: PropTypes.number,
    visible: PropTypes.bool,
    clickHandler: PropTypes.function
  };

  constructor(props) {
    super(props);
    const { selected } = props;
    this.state = { selected };
  }

  // componentWillReceiveProps(nextProps) {
  //   const { visible } = nextProps;
  //   if (!visible) this.setState({ selected: false });
  // }

  componentDidUpdate(prevProps, prevState) {
    const { clickHandler } = this.props;
    if (prevState.selected !== this.state.selected) {
      clickHandler({ ...this.props }, this.state.selected);

      // const elmnt = ReactDOM.findDOMNode(this);
      // elmnt.scrollIntoView();
    }
  }

  render() {
    const {
      children,
      defaultCol,
      visible,
      opacity,
      span,
      activeSpan,
      scrollTo,
      id
    } = this.props;
    const { selected } = this.state;

    // if (clicked) console.log(`${defaultCol} / span ${activeSpan}`);

    return (
      <div
        className={cx.item}
        style={{
          height: '100%',
          gridColumn: selected
            ? `${defaultCol} / span ${activeSpan}`
            : `span ${span}`,
          gridRowEnd: selected ? 'span 2' : 'span 1',
          opacity: visible || selected ? 1 : opacity
        }}
        onClick={() => {
          console.log('clickHandler', id);
          // const elmnt = ReactDOM.findDOMNode(this);
          // elmnt.scrollIntoView();
          if (visible) {
            this.setState(oldSt => ({
              selected: visible ? !oldSt.selected : null
            }));
            scrollTo();
          }
        }}
      >
        {children}
      </div>
    );
  }
}

Item.defaultProps = {
  clicked: false,
  opacity: 0.56,
  span: 1,
  activeSpan: 2,
  clickHandler: d => d
};

class ScrollView extends Component {
  static childContextTypes = {
    scroll: PropTypes.object
  };
  elements = {};
  register = (name, ref) => {
    this.elements[name] = ref;
  };
  unregister = name => {
    delete this.elements[name];
  };
  getChildContext() {
    return {
      scroll: {
        register: this.register,
        unregister: this.unregister
      }
    };
  }
  scrollTo = name => {
    const node = ReactDOM.findDOMNode(this.elements[name]);
    scrollIntoView(node, {
      time: 500
      // align: {
      //   top: 0
      // }
    });
  };
  render() {
    return React.Children.only(this.props.children);
  }
}

class ScrollElement extends Component {
  static contextTypes = {
    scroll: PropTypes.object
  };
  componentDidMount() {
    this.context.scroll.register(this.props.name, this._element);
  }
  componentWillUnmount() {
    this.context.scroll.unregister(this.props.name);
  }

  render() {
    return React.cloneElement(this.props.children, {
      ref: ref => (this._element = ref)
    });
  }
}

// export { ScrollElement };

export default Grid;
