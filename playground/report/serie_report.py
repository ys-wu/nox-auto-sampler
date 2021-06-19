from docxtpl import DocxTemplate


template = "serie_report.docx"
target = "generated_doc.docx"
doc = DocxTemplate(template)

date = '20210101'
temp = 'temp'
rh = 'rh'
pres = 'pres'
std_id = '18210-G8130817'
std_conc = 'std_conc'
range_ = 'range'
ave_time = 'ave_time'
flow = 'flow'
bkg = 'bkg'
no_c = 'no_c'
no2_c = 'no2_c'
nox_c = 'nox_c'
serie_id = "20210616test200"
results = 'results'

context = {
    'date': date,
    'temp': temp,
    'rh': rh,
    'pres': pres,
    'std_id': std_id,
    'std_conc': std_conc,
    'range': range_,
    'ave_time': ave_time,
    'flow': flow,
    'bkg': bkg,
    'no_c': no_c,
    'no2_c': no2_c,
    'nox_c': nox_c,
    'serie_id': serie_id,
    'results': results,
}

doc.render(context)
doc.save(target)
