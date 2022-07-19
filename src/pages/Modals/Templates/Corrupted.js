import logo from '../../Default/logo.svg';

function Corrupted(props) {

    //const db = props.data;

    return (
        <div id={props.id} className={props.classList + ' modal-corrupted'}>
            <h3 className='modal-title'>
                <img className='modal-logo' src={logo} alt='logo DC' />
                Corrupted File
            </h3>
            <div className='flex column' id='files-container'>
                <ul className="files-nok">
                    <li>{props.content}</li>
                </ul>
            </div>
        </div>
    );
}

export default Corrupted;