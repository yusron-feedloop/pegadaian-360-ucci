import React, {useState, useRef, useEffect} from 'react'
import {FiSearch} from 'react-icons/fi'
import {
    InputGroup,
    Input,
    InputRightElement
} from '@chakra-ui/react';
import { searchAudienceByProp } from '../libs/passion';
import styles from '../styles/SearchAutoComplete.module.css'

const SearchAutoComplete = ({onSelectResult, onEnter}) => {
    const [data, setData] = useState([]);
    const [showResult, setShowResult] = useState(false);

    const sb = useRef<HTMLInputElement>(null);

    let delayTime;

    const searchOnEnter = (e) => {
        if (delayTime) {
            clearTimeout(delayTime);
        }

        if(e.keyCode == 13) {
            setShowResult(false);

            fetch(`/api/search-suggestion?q=${e.target.value}`)
                .then(response => response.json())
                .then(response => {
                    response = response.filter(v => v.nik.length > 0)
                    if(response.length > 0){
                        onEnter(response[0].nik);
                    }else{
                        const Swal = require('sweetalert2')

                        Swal.fire({
                            title: "Not found",
                            text: "Nasabah tidak ditemukan",
                            icon: "error"
                        });
                    }
                });
        }else{
            delayTime = setTimeout(() => {
                fetch(`/api/search-suggestion?q=${e.target.value}`)
                    .then(response => response.json())
                    .then(response => {
                        response = response.filter(v => v.nik.length > 0)
                        setData(response);
                        setShowResult(true);
                    });
            }, 300);
        }
    }

    const searchAudience = (val, nik) => {
        const node = sb.current;
        if(node){
            node.value = val;
        }
        
        setShowResult(false);
        onSelectResult(nik);
    }

    const showPreviousResult = () =>{
        if(data.length > 0 && sb.current.value.length > 0){
            setShowResult(true);
        }
    }

    useEffect(() => {
        document.body.addEventListener('click', (e) => {
            if (!(e.target as HTMLElement).classList.contains('search-result') && (e.target as HTMLElement).id != 'search-field'){
                setShowResult(false);
            }
        });
    }, []);

    return (
        <div className={styles['search-auto-complete']}>
            <InputGroup>
                <Input type="text" placeholder="Cari Nama Lengkap" onKeyUp={e => searchOnEnter(e) } ref={sb} id="search-field" />
                <InputRightElement>
                    <FiSearch />
                </InputRightElement>
            </InputGroup>
            {showResult &&
                <div id={styles['search-result']}>
                    <ul>
                        {data.map((item, i) => (<li key={i}><a href="#" onClick={() => searchAudience(item.nama, item.nik)} className="search-result">{ item.nama }</a></li>))}
                    </ul>
                </div>
            }
        </div>
    );
}

export default SearchAutoComplete;