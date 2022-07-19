import logo from '../../Default/logo.svg';

function OpenFile(props) {

    //const db = props.data;

    return (
        <div id={props.id} className={props.classList + ' modal-openFile'}>
            <h3 className='modal-title'>
                <img className='modal-logo' src={logo} alt='logo DC' />
                Open File(s)
            </h3>
            {setContent(props.content)}
        </div>
    );
}

function setContent(files) {

    let nok = '<ul class="files-nok">',
        ok = '<ul class="files-ok">';

    for (let i = 0; i < files.length; i++) {

        let file = files[i];
        if (file.err === null) {
            ok += '<li>' + file.ok + '</li>';
        } else {
            nok += '<li>' + file.err + '</li>';
        }
    }

    nok += '</ul>';
    ok += '</ul>';

    nok = (nok !== '<ul class="files-nok"></ul>') ? nok : '';
    ok = (ok !== '<ul class="files-ok"></ul>') ? ok : '';

    return (
        <div className='flex column' id='files-container' dangerouslySetInnerHTML={{__html: nok + ok}}/>
    );
}

export default OpenFile;