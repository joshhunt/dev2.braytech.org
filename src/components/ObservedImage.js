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

    const srcSet = this.props.srcSet;
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

          // console.log(srcSet, entry.boundingClientRect.width);

          let displayWidth = entry.boundingClientRect.width;
          let dpr = window.devicePixelRatio;
          let sets = [];
          let data = srcSet.split(/,\s/);
        
          data.forEach(set => {
            let processed = /(.+)\s([0-9].+)w/i.exec(set);
            sets.push(
              {
                filePath: processed[1],
                width: processed[2]
              }
            )
          })

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

            
            let src = false;
            sets.forEach(set => {
              if (sets.length === 1) {
                src = set.filePath;
              }
              if (!src) {
                if (dpr === 1) {
                  if (set.width >= displayWidth) {
                    src = set.filePath;
                  }
                }
                else {
                  if (set.width >= displayWidth) {
                    src = set.filePath;
                  }
                }
              }
            })

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