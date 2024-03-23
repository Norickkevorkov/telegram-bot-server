module.exports = (currentEvent, adminBot, getAdminPerms) => async (data) => {
    console.log(data);
    if (currentEvent?.status === 'SET_PHOTO'){
        currentEvent.photo = data.photo[0].file_id;
        currentEvent.status = 'SET_DATE';
        await currentEvent.save();
    }
}