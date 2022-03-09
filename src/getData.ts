import { names, getRandomDataBetween, getRandomData, dataTypeFormats } from "./utilities";
import { SampleDataModel } from "./utilities/GetDataModel";
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const sampleData: SampleDataModel = {
    data: [],
    metaData: {
        col1: {
            name: 'RowId',
            dataType: 'Num',
        },
        col2: {
            name: 'Name',
            dataType: 'Text',
        },
        col3: {
            name: 'Age',
            dataType: 'Num',
        },
        col4: {
            name: 'exField1',
            dataType: 'Num',
        },
        col5: {
            name: 'exField2',
            dataType: 'Num',
        }
    },
};

const generateJsonFile = () => {
    let parent = -1;
    const subRows = 'subRows';
    const { data } = sampleData;
    for (let i = 0; i < 50000; i++) {
        if (i % 5 === 0) {
            parent = i;
        }
        if (i % 5 !== 0) {
            const num: number = isNaN((data.length % parent) - 1) ? 0 : (data.length % parent) - 1;
            data[num][subRows].push({
                uniqueId: uuidv4(),
                col1: i + 1,
                col2: names[Math.floor(Math.random() * names.length)],
                col3: getRandomDataBetween(20, 40),
                col4: getRandomData(200),
                col5: getRandomData(100)
            })
        } else {
            data.push({
                uniqueId: uuidv4(),
                col1: i + 1,
                col2: names[Math.floor(Math.random() * names.length)],
                col3: getRandomDataBetween(20, 40),
                col4: getRandomData(200),
                col5: getRandomData(100),
                [subRows]: []
            });
        }
    }

    fs.writeFile('./dist/sampleTreegrid.json', JSON.stringify(sampleData), 'utf-8', () => {
        console.log('file is written');
    })
}

const getSampleData = (req, res) => {
    res.header("Content-Type", 'application/json');
    res.sendFile(path.join(__dirname, './sampleTreegrid.json'));
}

const getModifiedData = (sampleData, selectedColumn, dataType, defaultValue) => {    
    return sampleData.data.map((item) => {
        item[selectedColumn] = dataType ? dataTypeFormats[dataType]() : defaultValue;
        const modifiedItem = { ...item };
        modifiedItem.subRows = modifiedItem.subRows.map((subItem) => {
            subItem[selectedColumn] = dataType ? dataTypeFormats[dataType]() : defaultValue;
            return subItem;
        });
        return modifiedItem;
    });
}

const writeToJsonFile = (updatedSampleData) => {
    fs.writeFile('./dist/sampleTreegrid.json', JSON.stringify(updatedSampleData), 'utf-8', () => {
        console.log('file is updated');
    });
}

const editColumn = (formData, socket) => {
    const { selectedColumn, colName, defaultValue, dataType } = formData;

    // let specificColumn = isForAdd ? 'col' + Object.keys(sampleData.metaData).length + 1 : selectedColumn;

    const updatedSampleData = {
        data: sampleData.data,
        metaData: sampleData.metaData,
    }
    
    if (updatedSampleData.metaData[selectedColumn].dataType != dataType) {        
        updatedSampleData.data = getModifiedData(sampleData, selectedColumn, dataType, defaultValue);
    }
    updatedSampleData.metaData[selectedColumn].name = colName;
    updatedSampleData.metaData[selectedColumn].dataType = dataType;        

    writeToJsonFile(updatedSampleData);

    const updatedData = {
        sampleData: updatedSampleData,
        formData
    }
    socket.emit('getUpdatedData', updatedData);
}

const deleteColumn = (selectedColumn, socket) => {
    const updatedSampleData = {
        data: [],
        metaData: sampleData.metaData,
    };

    updatedSampleData.data = sampleData.data
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .map(({ [selectedColumn]: colName, subRows, ...item }) => ({
            ...item,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            subRows: subRows.map(({ [selectedColumn]: colName, ...item }) => item)
        }));
    delete updatedSampleData.metaData[selectedColumn];

    writeToJsonFile(updatedSampleData);

    const updatedData = {
        sampleData: updatedSampleData,
        isForDeleteCol: true
    }

    socket.emit('getUpdatedData', updatedData)
}

export { 
    generateJsonFile, 
    getSampleData, 
    getModifiedData,
    editColumn, 
    deleteColumn, 
    sampleData, 
    writeToJsonFile 
};