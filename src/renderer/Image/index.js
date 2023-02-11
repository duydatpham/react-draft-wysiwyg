import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { EditorState, SelectionState, Modifier } from 'draft-js';
import classNames from 'classnames';
import Option from '../../components/Option';
import './styles.css';

const getImageComponent = config => class Image extends Component {
  static propTypes: Object = {
    block: PropTypes.object,
    contentState: PropTypes.object,
  };

  state: Object = {
    hovered: false,
  };

  setEntityAlignmentLeft: Function = (): void => {
    this.setEntityAlignment('left');
  };

  setEntityAlignmentRight: Function = (): void => {
    this.setEntityAlignment('right');
  };

  deleteItem: Function = (): void => {
    const { block, contentState } = this.props;
    const entityKey = block.getEntityAt(0);
    console.log('entityKey', entityKey, block.getKey())
    const newBlockMap = contentState.blockMap.delete(block.getKey())  // this is the important one that actually deletes a block
    console.log('newBlockMap', newBlockMap)
    const newContentState = contentState.set('blockMap', newBlockMap)
    // const newEditorState = EditorState.push(editorState, newContentState, 'remove-block')
    config.onChange(EditorState.push(config.getEditorState(), newContentState, 'remove-block'));
    // config.onChange(EditorState.push(config.getEditorState(), contentState, 'change-block-data'));
    this.setState({
      dummy: true,
    });

    // const mySelection = SelectionState.createEmpty(entityKey);
    // const updatedSelection = mySelection.merge({
    //   anchorOffset: 0,
    //   focusOffset: block.getText().length
    // })
    // const newContentState = Modifier.applyEntity(contentState, updatedSelection, null);

    // // config.onChange(EditorState.set(config.getEditorState(), { currentContent: newContentState }));
    // config.onChange(EditorState.push(config.getEditorState(), newContentState, 'change-block-data'));
    // this.setState({
    //   dummy: true,
    // });
  };

  setEntityAlignmentCenter: Function = (): void => {
    this.setEntityAlignment('none');
  };

  setEntityAlignment: Function = (alignment): void => {
    const { block, contentState } = this.props;
    const entityKey = block.getEntityAt(0);
    contentState.mergeEntityData(
      entityKey,
      { alignment },
    );
    config.onChange(EditorState.push(config.getEditorState(), contentState, 'change-block-data'));
    this.setState({
      dummy: true,
    });
  };

  toggleHovered: Function = (): void => {
    const hovered = !this.state.hovered;
    this.setState({
      hovered,
    });
  };

  renderAlignmentOptions(alignment): Object {
    return (
      <div
        className={classNames(
          'rdw-image-alignment-options-popup',
          {
            'rdw-image-alignment-options-popup-right': alignment === 'right',
          },
        )}
      >
        <Option
          onClick={this.setEntityAlignmentLeft}
          className="rdw-image-alignment-option"
        >
          Left
        </Option>
        <Option
          onClick={this.setEntityAlignmentCenter}
          className="rdw-image-alignment-option"
        >
          Center
        </Option>
        <Option
          onClick={this.setEntityAlignmentRight}
          className="rdw-image-alignment-option"
        >
          Right
        </Option>
        <Option
          onClick={this.deleteItem}
          className="rdw-image-alignment-option"
        >
          <span style={{ color: 'red' }} >Xoá</span>
        </Option>
      </div>
    );
  }

  render(): Object {
    const { block, contentState } = this.props;
    const { hovered } = this.state;
    const { isReadOnly, isImageAlignmentEnabled } = config;
    const entity = contentState.getEntity(block.getEntityAt(0));
    const { src, alignment, height, width, alt } = entity.getData();

    return (
      <span
        onMouseEnter={this.toggleHovered}
        onMouseLeave={this.toggleHovered}
        className={classNames(
          'rdw-image-alignment',
          {
            'rdw-image-left': alignment === 'left',
            'rdw-image-right': alignment === 'right',
            'rdw-image-center': !alignment || alignment === 'none',
          },
        )}
      >
        <span className="rdw-image-imagewrapper">
          <img
            src={src}
            alt={alt}
            style={{
              height,
              width,
            }}
          />
          {
            !isReadOnly() && hovered && isImageAlignmentEnabled() ?
              this.renderAlignmentOptions(alignment)
              :
              undefined
          }
        </span>
      </span>
    );
  }
};

export default getImageComponent;
