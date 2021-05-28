import React from 'react';

  changePic = () => {
    this.props.changePic;
  }

  const StyledDropzone = ({props}) => {
    const [files, setFiles, file] = useState([]);
    const {
      getRootProps,
      getInputProps,
      isDragActive,
      isDragAccept,
      isDragReject,
      acceptedFiles,
      open
    } = useDropzone({
      accept: "image/*",
      noClick: true,
      noKeyboard: true,
      onDrop: acceptedFiles => {
        setFiles(
          acceptedFiles.map(file =>
            Object.assign(file, {
              preview: URL.createObjectURL(file)
            })
          )
        );
      }
    });
  
    const style = useMemo(
      () => ({
        ...baseStyle,
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
      }),
      [isDragActive, isDragReject]
    );
  
    const thumbs = files.map(file => {
       (
      <div style={thumb} key={file.name}>
        <div style={thumbInner}>
          <img src={file.preview} style={img} />
        </div>
      </div>
    )});
  
    useEffect(
      () => () => {
        // Make sure to revoke the data uris to avoid memory leaks
        files.forEach(file => URL.revokeObjectURL(file.preview));
      },
      [files]
    );
  
    const filepath = acceptedFiles.map(file => (
      <li key={file.path}>
        {file.path} - {file.size} bytes
      </li>
    ));
  
    return (
      <div className="container">
        <div  {...getRootProps({ style })}>
          <input {...getInputProps()} />
          <p>Drag 'n' drop some files here</p>
          <button type="button" onClick={open}>
            Open File Dialog
          </button>
        </div>
        <aside>
          <h4>Files</h4>
          <ul>{filepath}</ul>
        </aside>
        <aside style={thumbsContainer}>{thumbs}</aside>
      </div>
    );
  }

  export default StyledDropzone;