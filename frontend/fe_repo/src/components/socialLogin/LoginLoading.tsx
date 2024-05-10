import LoadingSpinner from '../../assets/images/login/loadingSpinner.gif';
import Loading from '../../css/components/login/LodingSpinner.module.css'

function LoginLoading () {
    return (
        <div className={Loading.container}>
            <img src={LoadingSpinner} alt="loading-spinner" className={Loading.loadingSpinner} />
        </div>
    )
}

export default LoginLoading;