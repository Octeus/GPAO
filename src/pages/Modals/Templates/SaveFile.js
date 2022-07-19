import logo from '../../Default/logo.svg';

function SaveFile(props) {

    //const db = props.data;

    return (
        <div id={props.id} className={props.classList + ' modal-saveFile'}>
            <h3 className='modal-title'>
                <img className='modal-logo' src={logo} alt='logo DC' />
                Save File
            </h3>

        </div>
    );
}

export default SaveFile;
