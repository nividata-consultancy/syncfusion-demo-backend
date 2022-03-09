import { getModifiedData, sampleData, writeToJsonFile } from "./getData";

const addColumn = (formData, socket) => {
    const { colName, defaultValue, dataType } = formData;    

    const updatedSampleData = {
        data: [],
        metaData: sampleData.metaData,
    };

    const lenOfMetadataObj = Object.keys(sampleData.metaData).length;
    const lastCol = Object.keys(sampleData.metaData)[lenOfMetadataObj - 1];    
    const field = 'col' + (parseInt(lastCol.replace(/\D/g, "")) + 1);
    console.log(field);
    updatedSampleData.metaData[field] = {
        name: colName,
        dataType: dataType
    };

    updatedSampleData.data = getModifiedData(sampleData, field, dataType, defaultValue);

    writeToJsonFile(updatedSampleData);    

    const updatedData = {
        sampleData: updatedSampleData,
        formData,
        isForNewCol: true
    }

    socket.emit('getUpdatedData', updatedData)
}

export { addColumn };