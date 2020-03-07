import React from 'react';

class ClickOutside extends React.Component<{
  onClickOutside: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  className?: string;
}> {
  container = React.createRef<HTMLDivElement>();

  componentDidMount() {
    document.addEventListener('click', this.handleClick, true);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick, true);
  }

  handleClick = event => {
    const container = this.container.current;
    const { target } = event;
    const { onClickOutside } = this.props;

    if ((container && container === target) || (container && !container.contains(target))) {
      onClickOutside(event);
    }
  };

  render() {
    const { className, children } = this.props;

    return (
      <div className={className} ref={this.container}>
        {children}
      </div>
    );
  }
}

export default ClickOutside;
