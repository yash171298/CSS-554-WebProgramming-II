import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
//import '../App.css' from '../src/App.css';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 2,
    },
    appbar: {
        alignItems: 'center',
        backgroundColor: 'blue'
    },
    toolbar: {
        color: 'blue'
    }
}));
function NavBar() {


    const class1 = useStyles();
    return (
    <div>
        {/* <ThemeProvider theme={darkTheme}>
        <AppBar position="static" color="primary" enableColorOnDark>
          {appBarLabel('enableColorOnDark')}
        </AppBar>
        <AppBar position="static" color="primary">
        {appBarLabel('default')}
       </AppBar>
        </ThemeProvider> */}
        
        <AppBar position="static" alignItems='center' className={class1.appbar}  >

            <Toolbar className="toolbar" align='center' color='blue'>
                <Typography variant="h6" color="blue" align='center' className={class1.title}>
                    Binterest-Lab5
                </Typography>
            </Toolbar>
        </AppBar>
    </div>
    )
}

export default NavBar;