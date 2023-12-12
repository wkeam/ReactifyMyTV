import Time from './Time.jsx';

function Modal({channel, prechannel}){
    return (
        <span style={{
            position: 'absolute',
            zIndex: '2147483647',
            left: '10vw',
            top: '10vh',
            width: '80vw',
            height: '10vh',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            display: 'flex',
            alignItems: 'center', // Center vertically
            justifyContent: 'center', // Center horizontally
            color: '#fff', // Set text color
            fontSize: '4vh', // Set font size as needed
            borderRadius: '50px'
          }}>
            {/* {prechannel.index+1}  */}
            {prechannel.title}<img style={{height: '8vh'}} src={prechannel && prechannel.logo} alt="" /><Time />
        </span>
    );
}


export default Modal;