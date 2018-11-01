import React from 'react'
import cx from 'classnames'

class ObservedImage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      downloaded: false,
      styles: {

      }
    }
  }

  componentDidMount() {

    const src = this.props.src;
    const ratio = this.props.ratio ? this.props.ratio : false;

    if (ratio) {
      this.setState({
        styles: {
          paddingBottom: ratio * 100 + '%'
        }
      })
    }

    this.observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {

          const { isIntersecting } = entry;

          if (isIntersecting) {
        
            const loadImage = new window.Image();
            loadImage.onload = (bmp) => {

              let ratio = bmp.target.height / bmp.target.width

              if (this.props.className.includes("padding")) {
                
                this.setState({
                  downloaded: true,
                  styles: {
                    paddingBottom: ratio * 100 + '%',
                    backgroundImage: `url(${bmp.target.src})`
                  }
                })
                
              }
              else {

                this.setState({
                  downloaded: true,
                  styles: {
                    backgroundImage: `url(${bmp.target.src})`
                  }
                })

              }

              this.observer = this.observer.disconnect();

            };

            loadImage.src = src;
            
          }
          
        });
      }
    );
    
    this.observer.observe(this.element);

  }

  render() {

    const classNames = this.props.className

    return (
      <div
        {...this.props} 
        ref={el => this.element = el}
        className={cx(
          classNames,
          {
            'dl': this.state.downloaded
          }
        )}
        style={this.state.styles} />
    )

  }
}

export default ObservedImage